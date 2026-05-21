#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Color definitions for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}     ZERP Backend Rebuild & Run Script         ${NC}"
echo -e "${BLUE}===============================================${NC}"

# Parse options
COMPOSE_FILE_ARG=""
USE_CUSTOM_COMPOSE=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -a|--aggregated)
            COMPOSE_FILE_ARG="-f compose-app-aggregated.yaml"
            USE_CUSTOM_COMPOSE=true
            ;;
        -s|--services)
            COMPOSE_FILE_ARG="-f compose-app.yaml"
            USE_CUSTOM_COMPOSE=true
            ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  -a, --aggregated    Force rebuild and run using compose-app-aggregated.yaml"
            echo "  -s, --services      Force rebuild and run using compose-app.yaml"
            echo "  -h, --help          Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown parameter: $1${NC}"
            echo "Use -h or --help for usage details."
            exit 1
            ;;
    esac
    shift
done

# 1. Environment checks (Java, Maven, Docker)
echo -e "\n${YELLOW}[1/4] Checking System Dependencies...${NC}"

# Java Check
if command -v java >/dev/null 2>&1; then
    JAVA_VER=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
    # Java 25 version output format is usually "25" (or "25.x.x")
    if [[ "$JAVA_VER" != "25" ]]; then
        echo -e "${YELLOW}Warning: Java 25 is recommended, but found Java version: $JAVA_VER${NC}"
    else
        echo -e "${GREEN}✓ Java 25 is installed.${NC}"
    fi
else
    echo -e "${RED}Error: Java is not installed or not in PATH.${NC}"
    exit 1
fi

# Maven Check
if command -v mvn >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Maven is installed.${NC}"
else
    echo -e "${RED}Error: Maven is not installed or not in PATH. Please install Maven to compile the backend.${NC}"
    exit 1
fi

# Docker Check
if docker info >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Docker is running.${NC}"
else
    echo -e "${RED}Error: Docker daemon is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# 2. Build Backend Jars
echo -e "\n${YELLOW}[2/4] Compiling Backend JARs with Maven...${NC}"
# Run package from the parent POM
mvn -f zerp-backend/pom.xml clean package -DskipTests

echo -e "${GREEN}✓ Maven packaging completed successfully.${NC}"

# 3. Network Check
echo -e "\n${YELLOW}[3/4] Checking Docker Networks...${NC}"
if ! docker network inspect zerp-net >/dev/null 2>&1; then
    echo -e "${YELLOW}External docker network 'zerp-net' not found. Creating it...${NC}"
    docker network create zerp-net
    echo -e "${GREEN}✓ Network 'zerp-net' created.${NC}"
else
    echo -e "${GREEN}✓ Network 'zerp-net' already exists.${NC}"
fi

# 4. Deploy via Docker Compose
echo -e "\n${YELLOW}[4/4] Starting Docker Compose...${NC}"

# Navigate to docker directory so compose resolves relative paths correctly
cd docker

if [ "$USE_CUSTOM_COMPOSE" = true ]; then
    echo -e "${BLUE}Running custom compose configuration: ${COMPOSE_FILE_ARG}${NC}"
    docker compose $COMPOSE_FILE_ARG build
    docker compose $COMPOSE_FILE_ARG up -d --force-recreate
else
    # Try reading COMPOSE_FILE from .env if it exists
    if [ -f .env ]; then
        # Parse default COMPOSE_FILE value from .env
        ENV_COMPOSE_FILE=$(grep -E "^COMPOSE_FILE=" .env | cut -d'=' -f2 | tr -d "'" | tr -d '"')
        if [ -n "$ENV_COMPOSE_FILE" ]; then
            echo -e "${BLUE}Running default compose configuration from .env: ${ENV_COMPOSE_FILE}${NC}"
        else
            echo -e "${BLUE}Running default compose configuration...${NC}"
        fi
    else
        echo -e "${BLUE}Running default compose configuration...${NC}"
    fi
    docker compose build
    docker compose up -d --force-recreate
fi

echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN}   Rebuild and deployment complete!            ${NC}"
echo -e "${GREEN}===============================================${NC}"
