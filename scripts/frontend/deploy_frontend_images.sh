#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Kullanim:
  ./deploy_frontend_images.sh --remote-host user@host [secenekler]

Zorunlu:
  --remote-host            Uzak sunucu (or: ubuntu@1.2.3.4)

Opsiyonel:
  --local-compose          Lokal compose dosyasi
                           (varsayilan: <repo>/docker/compose-frontend.yaml)
  --remote-compose         Uzak compose dosyasi yolu
                           (varsayilan: ./docker/compose-frontend.yaml)
  --remote-upload-dir      Uzakta image tar dosyasinin kopyalanacagi klasor
                           (varsayilan: /tmp/zerp-frontend-deploy)
  --project-name           Compose project name
                           (varsayilan: zerp-frontend)
  --ssh-port               SSH portu (varsayilan: 22)
  --ssh-key                SSH private key dosyasi
  --version-file           Version counter dosyasi
                           (varsayilan: <script_dir>/.frontend_image_version)
  -h, --help               Yardim

Ornek:
  ./deploy_frontend_images.sh \
    --remote-host ubuntu@203.0.113.10 \
    --remote-compose /opt/zerp/docker/compose-frontend.yaml \
    --remote-upload-dir /opt/zerp/deploy-tmp \
    --project-name zerp-frontend
EOF
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

REMOTE_HOST=""
LOCAL_COMPOSE_FILE="${REPO_ROOT}/docker/compose-frontend.yaml"
REMOTE_COMPOSE_FILE="./docker/compose-frontend.yaml"
REMOTE_UPLOAD_DIR="/tmp/zerp-frontend-deploy"
PROJECT_NAME="zerp-frontend"
SSH_PORT="22"
SSH_KEY=""
VERSION_FILE="${SCRIPT_DIR}/.frontend_image_version"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --remote-host)
      REMOTE_HOST="${2:-}"
      shift 2
      ;;
    --local-compose)
      LOCAL_COMPOSE_FILE="${2:-}"
      shift 2
      ;;
    --remote-compose)
      REMOTE_COMPOSE_FILE="${2:-}"
      shift 2
      ;;
    --remote-upload-dir)
      REMOTE_UPLOAD_DIR="${2:-}"
      shift 2
      ;;
    --project-name)
      PROJECT_NAME="${2:-}"
      shift 2
      ;;
    --ssh-port)
      SSH_PORT="${2:-}"
      shift 2
      ;;
    --ssh-key)
      SSH_KEY="${2:-}"
      shift 2
      ;;
    --version-file)
      VERSION_FILE="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Bilinmeyen parametre: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "${REMOTE_HOST}" ]]; then
  echo "Hata: --remote-host zorunlu." >&2
  usage
  exit 1
fi

if [[ ! -f "${LOCAL_COMPOSE_FILE}" ]]; then
  echo "Hata: Lokal compose dosyasi bulunamadi: ${LOCAL_COMPOSE_FILE}" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Hata: docker bulunamadi." >&2
  exit 1
fi

if ! command -v scp >/dev/null 2>&1; then
  echo "Hata: scp bulunamadi." >&2
  exit 1
fi

if ! command -v ssh >/dev/null 2>&1; then
  echo "Hata: ssh bulunamadi." >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "Hata: pnpm bulunamadi." >&2
  exit 1
fi

SSH_OPTS=(-p "${SSH_PORT}")
SCP_OPTS=(-P "${SSH_PORT}")
if [[ -n "${SSH_KEY}" ]]; then
  SSH_OPTS+=(-i "${SSH_KEY}")
  SCP_OPTS+=(-i "${SSH_KEY}")
fi

echo "1/5 Frontend projeleri lokal olarak build ediliyor..."
for APP_NAME in "zerp-admin" "zerp-tenant" "zerp-client"; do
  echo "Building ${APP_NAME}..."
  (
    cd "${REPO_ROOT}/zerp-frontend/${APP_NAME}"
    pnpm install --frozen-lockfile=false
    pnpm build
  )
done

echo "Frontend compose image'lari build ediliyor..."
export DOCKER_DEFAULT_PLATFORM=linux/amd64
docker compose -p "${PROJECT_NAME}" -f "${LOCAL_COMPOSE_FILE}" build

echo "2/5 Olusan image isimleri okunuyor ve tar dosyasi olusturuluyor..."
IMAGES=()
while IFS= read -r image_name; do
  [[ -n "${image_name}" ]] && IMAGES+=("${image_name}")
done < <(docker compose -p "${PROJECT_NAME}" -f "${LOCAL_COMPOSE_FILE}" config --images | sed '/^[[:space:]]*$/d' | sort -u)

if [[ ${#IMAGES[@]} -eq 0 ]]; then
  echo "Hata: Compose'dan image bulunamadi." >&2
  exit 1
fi

CURRENT_VERSION="0"
if [[ -f "${VERSION_FILE}" ]]; then
  CURRENT_VERSION="$(tr -d '[:space:]' < "${VERSION_FILE}")"
  if [[ -z "${CURRENT_VERSION}" ]]; then
    CURRENT_VERSION="0"
  fi
fi

if ! [[ "${CURRENT_VERSION}" =~ ^[0-9]+$ ]]; then
  echo "Hata: Version dosyasi sayisal degil: ${VERSION_FILE}" >&2
  exit 1
fi

NEXT_VERSION=$((CURRENT_VERSION + 1))
VERSION_TAG="$(printf '%03d' "${NEXT_VERSION}")"

TAGGED_IMAGES=()
for image_name in "${IMAGES[@]}"; do
  image_without_digest="${image_name%@*}"
  image_last_segment="${image_without_digest##*/}"
  if [[ "${image_last_segment}" == *:* ]]; then
    image_repo="${image_without_digest%:*}"
  else
    image_repo="${image_without_digest}"
  fi

  latest_image="${image_repo}:latest"
  docker tag "${image_name}" "${latest_image}"
  TAGGED_IMAGES+=("${latest_image}")
done

printf '%s\n' "${NEXT_VERSION}" > "${VERSION_FILE}"
echo "Image version tag: ${VERSION_TAG} (not tagged to Docker images)"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

IMAGE_BUNDLE="${TMP_DIR}/frontend-images-$(date +%Y%m%d%H%M%S).tar"
docker save -o "${IMAGE_BUNDLE}" "${TAGGED_IMAGES[@]}"

REMOTE_BUNDLE="${REMOTE_UPLOAD_DIR}/$(basename "${IMAGE_BUNDLE}")"

echo "3/5 Image tar dosyasi uzak sunucuya gonderiliyor..."
ssh "${SSH_OPTS[@]}" "${REMOTE_HOST}" "mkdir -p '${REMOTE_UPLOAD_DIR}'"
scp "${SCP_OPTS[@]}" "${IMAGE_BUNDLE}" "${REMOTE_HOST}:${REMOTE_BUNDLE}"

echo "4/5 SSH ile baglaniliyor, image load ve compose up calistiriliyor..."
ssh "${SSH_OPTS[@]}" "${REMOTE_HOST}" \
  "REMOTE_BUNDLE='${REMOTE_BUNDLE}' REMOTE_COMPOSE_FILE='${REMOTE_COMPOSE_FILE}' PROJECT_NAME='${PROJECT_NAME}' bash -s" <<'REMOTE_EOF'
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "Hata: Uzak sunucuda docker bulunamadi." >&2
  exit 1
fi

if [[ ! -f "${REMOTE_COMPOSE_FILE}" ]]; then
  echo "Hata: Uzak compose dosyasi bulunamadi: ${REMOTE_COMPOSE_FILE}" >&2
  exit 1
fi

docker load -i "${REMOTE_BUNDLE}"
# docker compose -p "${PROJECT_NAME}" -f "${REMOTE_COMPOSE_FILE}" up -d --no-build --remove-orphans
# rm -f "${REMOTE_BUNDLE}"
REMOTE_EOF

# echo "5/5 Tamamlandi: Build -> Tar -> SCP -> SSH -> Compose Up akisi bitti."
