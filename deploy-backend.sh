#!/usr/bin/env bash
#
# deploy-backend.sh — Server-side deployment script
#
# Downloads pre-built JAR files from a GitHub Release and
# rebuilds / restarts the backend Docker Compose services.
#
# Usage:
#   ./deploy-backend.sh --tag <git-tag> [--repo owner/repo] [--token TOKEN]
#
# The script is designed to run from the repository root at /opt/zerp.
#

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ── Defaults ─────────────────────────────────────────────────────────────────
TAG=""
REPO=""
TOKEN=""
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── Help ─────────────────────────────────────────────────────────────────────
show_help() {
    echo "Usage: $0 --tag <git-tag> [options]"
    echo ""
    echo "Options:"
    echo "  --tag    TAG       Git tag / release version to deploy (required)"
    echo "  --repo   OWNER/REPO  GitHub repository (default: auto-detected from git remote)"
    echo "  --token  TOKEN     GitHub Personal Access Token (required for private repos)"
    echo "  -h, --help         Show this help message"
}

# ── Parse Arguments ──────────────────────────────────────────────────────────
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --tag)   TAG="$2";   shift ;;
        --repo)  REPO="$2";  shift ;;
        --token) TOKEN="$2"; shift ;;
        -h|--help) show_help; exit 0 ;;
        *)
            echo -e "${RED}Unknown parameter: $1${NC}"
            show_help
            exit 1
            ;;
    esac
    shift
done

# ── Validate ─────────────────────────────────────────────────────────────────
if [ -z "$TAG" ]; then
    echo -e "${RED}Error: --tag is required.${NC}"
    show_help
    exit 1
fi

if [ -z "$REPO" ]; then
    REPO=$(git -C "$SCRIPT_DIR" remote get-url origin 2>/dev/null \
        | sed -E 's|.*github\.com[:/]||' \
        | sed -E 's|\.git$||')
    if [ -z "$REPO" ]; then
        echo -e "${RED}Error: Could not auto-detect repository. Use --repo owner/repo.${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  ZERP Backend Deploy — ${TAG}${NC}"
echo -e "${BLUE}  Repository: ${REPO}${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

# ── Dependency Checks ────────────────────────────────────────────────────────
echo -e "\n${YELLOW}[1/4] Checking dependencies...${NC}"

for cmd in curl jq docker; do
    if ! command -v "$cmd" &>/dev/null; then
        echo -e "${RED}Error: '$cmd' is required but not installed.${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✓ curl, jq, docker found.${NC}"

if ! docker info &>/dev/null; then
    echo -e "${RED}Error: Docker daemon is not running.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker daemon is running.${NC}"

# ── Download JARs ────────────────────────────────────────────────────────────
echo -e "\n${YELLOW}[2/4] Downloading JARs from GitHub Release...${NC}"

JARS_DIR="$SCRIPT_DIR/jars"
mkdir -p "$JARS_DIR"

API_URL="https://api.github.com/repos/$REPO/releases/tags/$TAG"

# Build auth arguments
AUTH_ARGS=()
if [ -n "$TOKEN" ]; then
    AUTH_ARGS+=(-H "Authorization: token $TOKEN")
fi

# Fetch release metadata
RELEASE_JSON=$(curl -sL "${AUTH_ARGS[@]+"${AUTH_ARGS[@]}"}" "$API_URL")

# Check for errors
if echo "$RELEASE_JSON" | jq -e '.message' &>/dev/null; then
    MSG=$(echo "$RELEASE_JSON" | jq -r '.message')
    echo -e "${RED}Error from GitHub API: $MSG${NC}"
    echo -e "${RED}Make sure the tag '$TAG' exists and (if private) a valid --token is provided.${NC}"
    exit 1
fi

ASSET_COUNT=$(echo "$RELEASE_JSON" | jq '[.assets[] | select(.name | endswith(".jar"))] | length')

if [ "$ASSET_COUNT" -eq 0 ]; then
    echo -e "${RED}Error: No JAR assets found in release '$TAG'.${NC}"
    exit 1
fi

echo -e "${BLUE}Found $ASSET_COUNT JAR asset(s). Downloading...${NC}"

# Download each JAR using browser_download_url (works for public repos)
# or with auth header (required for private repos)
echo "$RELEASE_JSON" | jq -r '.assets[] | select(.name | endswith(".jar")) | "\(.name) \(.browser_download_url)"' \
| while read -r name url; do
    echo -n "  ↓ $name ... "
    curl -sL "${AUTH_ARGS[@]+"${AUTH_ARGS[@]}"}" "$url" -o "$JARS_DIR/$name"
    echo -e "${GREEN}done${NC}"
done

echo -e "${GREEN}✓ All JARs downloaded to $JARS_DIR${NC}"
ls -lh "$JARS_DIR"/*.jar

# ── Docker Network ───────────────────────────────────────────────────────────
echo -e "\n${YELLOW}[3/4] Checking Docker network...${NC}"

if ! docker network inspect zerp-net &>/dev/null; then
    echo -e "${YELLOW}Creating external network 'zerp-net'...${NC}"
    docker network create zerp-net
fi
echo -e "${GREEN}✓ Network 'zerp-net' is ready.${NC}"

# ── Docker Compose ───────────────────────────────────────────────────────────
echo -e "\n${YELLOW}[4/4] Building and starting containers...${NC}"

cd "$SCRIPT_DIR/docker"

docker compose -f compose-deploy.yaml build
docker compose -f compose-deploy.yaml up -d --force-recreate

echo -e "\n${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Deploy complete!  Tag: ${TAG}${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo ""
docker compose -f compose-deploy.yaml ps
