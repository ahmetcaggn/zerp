TENANT_DIR := zerp-tenant
ADMIN_DIR := zerp-admin
CLIENT_DIR := zerp-client
APP_MAKEFILE := makefile

FORWARD_TARGETS := \
	download-openapi-cli-if-not-exists \
	ensure-specs-dir \
	download-merged-spec \
	download-crm-spec \
	download-employee-spec \
	download-notification-spec \
	download-all-specs \
	generate-merged-api \
	generate-crm-api \
	generate-employee-api \
	generate-notification-api \
	generate-all-apis \
	fetch-and-generate-merged-api \
	fetch-and-generate-crm-api \
	fetch-and-generate-employee-api \
	fetch-and-generate-notification-api \
	fetch-and-generate-all-apis

.DEFAULT_GOAL := help

.PHONY: help tenant-% admin-% client-% all-% $(FORWARD_TARGETS)

help:
	@echo "Frontend API codegen orchestrator"
	@echo
	@echo "App-scoped targets:"
	@echo "  make tenant-<target>   # runs in $(TENANT_DIR)"
	@echo "  make admin-<target>    # runs in $(ADMIN_DIR)"
	@echo "  make client-<target>   # runs in $(CLIENT_DIR)"
	@echo
	@echo "All apps:"
	@echo "  make all-<target>      # runs tenant -> admin -> client"
	@echo
	@echo "Direct aliases (all apps):"
	@echo "  make generate-all-apis"
	@echo "  make fetch-and-generate-all-apis"
	@echo "  make download-all-specs"

tenant-%:
	@$(MAKE) -C $(TENANT_DIR) -f $(APP_MAKEFILE) $*

admin-%:
	@$(MAKE) -C $(ADMIN_DIR) -f $(APP_MAKEFILE) $*

client-%:
	@$(MAKE) -C $(CLIENT_DIR) -f $(APP_MAKEFILE) $*

all-%:
	@$(MAKE) tenant-$*
	@$(MAKE) admin-$*
	@$(MAKE) client-$*
	@echo "Completed '$*' for tenant/admin/client."

$(FORWARD_TARGETS):
	@$(MAKE) all-$@
