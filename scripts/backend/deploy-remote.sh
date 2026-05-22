#!/usr/bin/env bash

# deploy-remote.sh — Build, save, and deploy ZERP backend to a remote server.
#
# Usage:
#   ./scripts/deploy-remote.sh --host-alias <alias> [--path /opt/zerp] [--aggregated]
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
AGGREGATED=false
SKIP_BUILD_UPLOAD=false
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

show_help() {
    echo "Usage: $0 --host-alias <alias> [options]"
    echo ""
    echo "Options:"
    echo "  --host-alias ALIAS     SSH host alias from ~/.ssh/config (required)"
    echo "  --path       PATH      Remote deployment path (default: /opt/zerp)"
    echo "  --aggregated           Deploy the aggregated version"
    echo "  --skip-build-upload    Skip build and upload steps, only run remote startup"
    echo "  -h, --help             Show this help message"
}

# ── Parse Arguments ──────────────────────────────────────────────────────────
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --host-alias)       HOST_ALIAS="$2"; shift ;;
        --path)             REMOTE_PATH="$2"; shift ;;
        --aggregated)       AGGREGATED=true ;;
        --skip-build-upload) SKIP_BUILD_UPLOAD=true ;;
    esac
    shift
done

if [[ -z "$HOST_ALIAS" ]]; then
    echo -e "${RED}Error: --host-alias is required.${NC}"
    show_help
    exit 1
fi

echo -e "${BLUE}=== Starting Deployment to $HOST_ALIAS ===${NC}"

if [ "$SKIP_BUILD_UPLOAD" = false ]; then
    # 1. Build Backend
    echo -e "${YELLOW}Step 1: Building backend JARs...${NC}"
    cd "$WORKSPACE_ROOT/zerp-backend"
    mvn clean package -DskipTests
    cd "$WORKSPACE_ROOT"

    # 2. Build Docker Images
    echo -e "${YELLOW}Step 2: Building Docker images locally for linux/amd64...${NC}"
    # Build both as requested using buildx to ensure correct architecture for remote
    export DOCKER_DEFAULT_PLATFORM=linux/amd64
    echo "Building standard app images..."
    docker compose -p zerp -f docker/compose-app.yaml build
    echo "Building aggregated app images..."
    docker compose -p zerp -f docker/compose-app-aggregated.yaml build

    # 3. Save Images
    echo -e "${YELLOW}Step 3: Saving and compressing images...${NC}"
    BUILD_DIR="$WORKSPACE_ROOT/build-deploy"
    mkdir -p "$BUILD_DIR/images"

    # List of all possible services across both compose files
    SERVICES=("eureka" "gateway" "crm" "employee" "notification" "resource" "sale" "suggestion" "user" "aggregated")

    for service in "${SERVICES[@]}"; do
        IMAGE_NAME="zerp-$service"
        if docker image inspect "$IMAGE_NAME" >/dev/null 2>&1; then
            echo "Saving $IMAGE_NAME..."
            docker save "$IMAGE_NAME" | gzip > "$BUILD_DIR/images/$service.tar.gz"
        else
            echo -e "${YELLOW}Warning: Image $IMAGE_NAME not found, skipping save.${NC}"
        fi
    done

    # 4. Prepare Remote Directory Structure
    echo -e "${YELLOW}Step 4: Preparing remote server...${NC}"
    ssh "$HOST_ALIAS" "mkdir -p $REMOTE_PATH/docker $REMOTE_PATH/zerp-backend/local $REMOTE_PATH/images"

    # 5. Upload Configuration and Images
    echo -e "${YELLOW}Step 5: Uploading files via SCP...${NC}"

    # Upload docker compose files (excluding .env as requested)
    scp docker/*.yaml "$HOST_ALIAS:$REMOTE_PATH/docker/"
    echo -e "${BLUE}Notice: .env file upload is skipped. Ensure it is configured manually on the remote at $REMOTE_PATH/.env${NC}"

    # Upload local config (required by volumes)
    echo "Uploading docker-config..."
    scp -r "zerp-backend/local/docker-config" "$HOST_ALIAS:$REMOTE_PATH/zerp-backend/local/"

    # Upload images
    echo "Uploading images (this may take a while)..."
    scp "$BUILD_DIR/images"/*.tar.gz "$HOST_ALIAS:$REMOTE_PATH/images/"
else
    echo -e "${BLUE}Skipping build and upload steps...${NC}"
fi

# 6. Remote Execution
echo -e "${YELLOW}Step 6: Loading images and starting containers on remote...${NC}"
COMPOSE_FILE="compose-app.yaml"
if [ "$AGGREGATED" = true ]; then
    COMPOSE_FILE="compose-app-aggregated.yaml"
fi

ssh "$HOST_ALIAS" << EOF
    cd "$REMOTE_PATH"
    
    if [ "$SKIP_BUILD_UPLOAD" = false ]; then
        echo "Loading images..."
        for img in images/*.tar.gz; do
            echo "Loading \$img..."
            docker load < "\$img"
        done
    else
        echo "Skipping image load..."
    fi
    
    echo "Ensuring docker network 'zerp-net' exists..."
    docker network inspect zerp-net >/dev/null 2>&1 || docker network create zerp-net

    echo "Starting services using $COMPOSE_FILE..."
    # Note: We need to be in the folder where the relative paths in compose file make sense
    # The compose files use context: .. and paths like ../zerp-backend/local/...
    # So we should run from the 'root' of our deployment.
    
    docker compose -p zerp -f docker/$COMPOSE_FILE up -d
EOF

echo -e "${GREEN}=== Deployment Completed Successfully ===${NC}"
if [ "$SKIP_BUILD_UPLOAD" = false ]; then
    echo -e "${BLUE}Cleaning up local build files...${NC}"
    rm -rf "$BUILD_DIR"
fi
