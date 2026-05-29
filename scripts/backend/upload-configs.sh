#!/usr/bin/env bash

# upload-configs.sh — Upload Docker configuration files to a remote server.
#
# Usage:
#   ./scripts/backend/upload-configs.sh --host-alias <alias> [--path /opt/zerp]
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

LOCAL_CONFIG_PATH="zerp-backend/local/docker-config"
LOCAL_CONFIG_DIR="$WORKSPACE_ROOT/$LOCAL_CONFIG_PATH"

echo -e "${BLUE}=== Uploading Config Files to $HOST_ALIAS ===${NC}"

if [ ! -d "$LOCAL_CONFIG_DIR" ]; then
    echo -e "${RED}Error: Local config directory $LOCAL_CONFIG_DIR not found.${NC}"
    exit 1
fi

# Ensure remote parent directory exists
ssh "$HOST_ALIAS" "mkdir -p $REMOTE_PATH/zerp-backend/local"

echo -e "Uploading ${GREEN}$LOCAL_CONFIG_PATH${NC} to ${GREEN}$REMOTE_PATH/zerp-backend/local/${NC}..."

# Use scp -r to upload the directory and its contents
# This will overwrite existing files
scp -r "$LOCAL_CONFIG_DIR" "$HOST_ALIAS:$REMOTE_PATH/zerp-backend/local/"

echo -e "${GREEN}=== Upload Completed ===${NC}"
