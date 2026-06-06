#!/usr/bin/env bash

# upload-compose.sh — Upload Docker Compose files to a remote server.
#
# Usage:
#   ./scripts/upload-compose.sh --host-alias <alias> [--path /opt/zerp] [file1.yaml file2.yaml ...]
#

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ── Defaults ─────────────────────────────────────────────────────────────────
HOST_ALIAS=""
REMOTE_PATH="/opt/zerp"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Strictly defined files to upload
FILES_TO_UPLOAD=(
    "compose-app.yaml"
    "compose-app-aggregated.yaml"
    "compose-deploy.yaml"
    "compose-kafka.yaml"
    "compose-postgres.yaml"
    "compose-redis.yaml"
    "compose-storage.yaml"
    "compose-apm.yaml"
    "prometheus.yml"
    "logstash.conf"
    "compose-opensearch.yaml"
    "compose-cadvisor.yaml"
)

show_help() {
    echo "Usage: $0 --host-alias <alias> [options]"
    echo ""
    echo "Options:"
    echo "  --host-alias ALIAS  SSH host alias from ~/.ssh/config (required)"
    echo "  --path       PATH   Remote deployment path (default: /opt/zerp)"
    echo "  -h, --help          Show this help message"
}

# ── Parse Arguments ──────────────────────────────────────────────────────────
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --host-alias) HOST_ALIAS="$2"; shift ;;
        --path)       REMOTE_PATH="$2"; shift ;;
        -h|--help)    show_help; exit 0 ;;
        *)            echo -e "${RED}Unknown parameter: $1${NC}"; show_help; exit 1 ;;
    esac
    shift
done

if [[ -z "$HOST_ALIAS" ]]; then
    echo -e "${RED}Error: --host-alias is required.${NC}"
    show_help
    exit 1
fi

echo -e "${BLUE}=== Uploading Compose Files to $HOST_ALIAS ===${NC}"

# Ensure remote directory exists
ssh "$HOST_ALIAS" "mkdir -p $REMOTE_PATH/docker"

for file in "${FILES_TO_UPLOAD[@]}"; do
    LOCAL_FILE="$WORKSPACE_ROOT/docker/$file"
    
    # Try directory-relative path if not found in docker/
    if [ ! -f "$LOCAL_FILE" ] && [ -f "$WORKSPACE_ROOT/$file" ]; then
        LOCAL_FILE="$WORKSPACE_ROOT/$file"
    fi

    if [ -f "$LOCAL_FILE" ]; then
        echo -e "Uploading ${GREEN}$file${NC}..."
        scp "$LOCAL_FILE" "$HOST_ALIAS:$REMOTE_PATH/docker/$(basename "$file")"
    else
        echo -e "${RED}Error: File $file not found locally.${NC}"
    fi
done

echo -e "${GREEN}=== Upload Completed ===${NC}"
