#!/usr/bin/env bash

# build_and_push.sh — Build frontend projects, run docker compose build, tag and push to Docker Hub.
#
# Usage:
#   ./scripts/frontend/build_and_push.sh <docker-hub-username> [tag]
#
# Example:
#   ./scripts/frontend/build_and_push.sh docker_username 1.0.0
#

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ── Directories ──────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

usage() {
  echo -e "${YELLOW}Usage:${NC}"
  echo -e "  $0 <docker-hub-username> [tag]"
  echo ""
  echo -e "${YELLOW}Example:${NC}"
  echo -e "  $0 docker_username"
  echo -e "  $0 docker_username 1.0.0"
  exit 1
}

# ── Parse & Validate Arguments ───────────────────────────────────────────────
DOCKER_USER="${1:-}"
TAG="${2:-latest}"

if [[ -z "${DOCKER_USER}" ]]; then
  echo -e "${RED}Error: Docker Hub username is required.${NC}"
  usage
fi

# ── Dependency Checks ────────────────────────────────────────────────────────
for cmd in docker pnpm; do
  if ! command -v "$cmd" &> /dev/null; then
    echo -e "${RED}Error: Required command '$cmd' is not installed.${NC}"
    exit 1
  fi
done

# ── 1. Install Dependencies ──────────────────────────────────────────────────
echo -e "${BLUE}=== Step 1/5: Installing Dependencies ===${NC}"
APPS=("zerp-tenant" "zerp-client" "zerp-admin")

for APP in "${APPS[@]}"; do
  echo -e "${YELLOW}Running pnpm install for ${APP}...${NC}"
  (
    cd "${REPO_ROOT}/zerp-frontend/${APP}"
    pnpm install --frozen-lockfile=false
  )
done

# ── 2. Build Frontend Projects ───────────────────────────────────────────────
echo -e "${BLUE}=== Step 2/5: Building Frontend Projects ===${NC}"
for APP in "${APPS[@]}"; do
  echo -e "${YELLOW}Building ${APP} (pnpm build)...${NC}"
  (
    cd "${REPO_ROOT}/zerp-frontend/${APP}"
    pnpm build
  )
done

# ── 3. Docker Compose Build ──────────────────────────────────────────────────
echo -e "${BLUE}=== Step 3/5: Running Docker Compose Build ===${NC}"
export DOCKER_DEFAULT_PLATFORM=linux/amd64
docker compose -f "${REPO_ROOT}/docker/compose-frontend-build.yaml" build --no-cache

# ── 4. Tag Images for Docker Hub ─────────────────────────────────────────────
echo -e "${BLUE}=== Step 4/5: Tagging Docker Images ===${NC}"
LOCAL_IMAGES=("ahmetcaggn/zerp-admin:latest" "ahmetcaggn/zerp-tenant:latest" "ahmetcaggn/zerp-client:latest")
REMOTE_REPOS=("zerp-admin" "zerp-tenant" "zerp-client")

for i in "${!LOCAL_IMAGES[@]}"; do
  local_img="${LOCAL_IMAGES[$i]}"
  remote_repo="${DOCKER_USER}/${REMOTE_REPOS[$i]}"

  echo -e "${YELLOW}Tagging ${local_img} -> ${remote_repo}:${TAG}${NC}"
  docker tag "${local_img}" "${remote_repo}:${TAG}"

  if [[ "${TAG}" != "latest" ]]; then
    echo -e "${YELLOW}Tagging ${local_img} -> ${remote_repo}:latest${NC}"
    docker tag "${local_img}" "${remote_repo}:latest"
  fi
done

# ── 5. Push Images to Docker Hub ─────────────────────────────────────────────
echo -e "${BLUE}=== Step 5/5: Pushing Images to Docker Hub ===${NC}"
for repo in "${REMOTE_REPOS[@]}"; do
  remote_repo="${DOCKER_USER}/${repo}"

  echo -e "${YELLOW}Pushing ${remote_repo}:${TAG}...${NC}"
  docker push "${remote_repo}:${TAG}"

  if [[ "${TAG}" != "latest" ]]; then
    echo -e "${YELLOW}Pushing ${remote_repo}:latest...${NC}"
    docker push "${remote_repo}:latest"
  fi
done

echo -e "${GREEN}=== Build and Push completed successfully! ===${NC}"
