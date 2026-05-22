OPENAPI_CODEGEN_VERSION := 7.20.0
OPENAPI_CODEGEN_JAR := ./openapi-generator-cli-$(OPENAPI_CODEGEN_VERSION).jar
CUSTOM_CODEGEN_VERSION := 0.1.17
CUSTOM_CODEGEN_JAR := ./openapi-dart-network-codegen-$(CUSTOM_CODEGEN_VERSION).jar
CONFIG_FILE := openapi-conf.yaml
GENERATOR := dart-network
SPECS_DIR := ./openapi-specs

SPEC_BASE_URL ?= https://api.zeerp.tech/

MERGED_SPEC_URL=$(SPEC_BASE_URL)gateway/v3/api-docs/merged
MERGED_SPEC_FILE=$(SPECS_DIR)/merged-api-spec.json
MERGED_PUB_NAME=openapi_merged
MERGED_OUTPUT_DIR=./modules/$(MERGED_PUB_NAME)

CRM_SPEC_URL := $(SPEC_BASE_URL)v3/api-docs/crm
CRM_SPEC_FILE := $(SPECS_DIR)/crm-api-spec.json
CRM_PUB_NAME := openapi_crm
CRM_OUTPUT_DIR := ./modules/$(CRM_PUB_NAME)

EMPLOYEE_SPEC_URL := $(SPEC_BASE_URL)v3/api-docs/employee
EMPLOYEE_SPEC_FILE := $(SPECS_DIR)/employee-api-spec.json
EMPLOYEE_PUB_NAME := openapi_employee
EMPLOYEE_OUTPUT_DIR := ./modules/$(EMPLOYEE_PUB_NAME)

NOTIFICATION_SPEC_URL := $(SPEC_BASE_URL)v3/api-docs/notification
NOTIFICATION_SPEC_FILE := $(SPECS_DIR)/notification-api-spec.json
NOTIFICATION_PUB_NAME := openapi_notification
NOTIFICATION_OUTPUT_DIR := ./modules/$(NOTIFICATION_PUB_NAME)

RESOURCE_SPEC_URL := $(SPEC_BASE_URL)v3/api-docs/resource
RESOURCE_SPEC_FILE := $(SPECS_DIR)/resource-api-spec.json
RESOURCE_PUB_NAME := openapi_resource
RESOURCE_OUTPUT_DIR := ./modules/$(RESOURCE_PUB_NAME)

SALE_SPEC_URL := $(SPEC_BASE_URL)v3/api-docs/sale
SALE_SPEC_FILE := $(SPECS_DIR)/sale-api-spec.json
SALE_PUB_NAME := openapi_sale
SALE_OUTPUT_DIR := ./modules/$(SALE_PUB_NAME)

SUGGESTION_SPEC_URL := $(SPEC_BASE_URL)v3/api-docs/suggestion
SUGGESTION_SPEC_FILE := $(SPECS_DIR)/suggestion-api-spec.json
SUGGESTION_PUB_NAME := openapi_suggestion
SUGGESTION_OUTPUT_DIR := ./modules/$(SUGGESTION_PUB_NAME)

USER_SPEC_URL := $(SPEC_BASE_URL)v3/api-docs/user
USER_SPEC_FILE := $(SPECS_DIR)/user-api-spec.json
USER_PUB_NAME := openapi_user
USER_OUTPUT_DIR := ./modules/$(USER_PUB_NAME)

download-openapi-cli-if-not-exists:
	# Check if the OpenAPI Generator CLI jar file exists, and download it if it doesn't
	if [ ! -f $(OPENAPI_CODEGEN_JAR) ]; then \
	    echo "OpenAPI Generator CLI not found. Downloading..."; \
	    curl -fL -o $(OPENAPI_CODEGEN_JAR) https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/$(OPENAPI_CODEGEN_VERSION)/openapi-generator-cli-$(OPENAPI_CODEGEN_VERSION).jar; \
	else \
	    echo "OpenAPI Generator CLI already exists."; \
	fi

download-codegen-if-not-exists:
	# Check if the custom code generator jar file exists, and download it if it doesn't
	if [ ! -f $(CUSTOM_CODEGEN_JAR) ]; then \
	    echo "Custom code generator not found. Downloading..."; \
	    curl -fL -o $(CUSTOM_CODEGEN_JAR) https://github.com/femrek/dart-network-openapi-codegen/releases/download/v${CUSTOM_CODEGEN_VERSION}/openapi-dart-network-codegen-${CUSTOM_CODEGEN_VERSION}.jar; \
	else \
	    echo "OpenAPI Generator CLI already exists."; \
	fi

ensure-specs-dir:
	mkdir -p $(SPECS_DIR)

download-merged-spec: ensure-specs-dir
	echo "Downloading merged API spec..."; \
	curl -fL -o $(MERGED_SPEC_FILE) $(MERGED_SPEC_URL); \

download-crm-spec: ensure-specs-dir
	echo "Downloading CRM API spec..."; \
	curl -fL -o $(CRM_SPEC_FILE) $(CRM_SPEC_URL); \

download-employee-spec: ensure-specs-dir
	echo "Downloading Employee API spec..."; \
	curl -fL -o $(EMPLOYEE_SPEC_FILE) $(EMPLOYEE_SPEC_URL); \

download-notification-spec: ensure-specs-dir
	echo "Downloading Notification API spec..."; \
	curl -fL -o $(NOTIFICATION_SPEC_FILE) $(NOTIFICATION_SPEC_URL); \

download-resource-spec: ensure-specs-dir
	echo "Downloading Resource API spec..."; \
	curl -fL -o $(RESOURCE_SPEC_FILE) $(RESOURCE_SPEC_URL); \

download-sale-spec: ensure-specs-dir
	echo "Downloading Sale API spec..."; \
	curl -fL -o $(SALE_SPEC_FILE) $(SALE_SPEC_URL); \

download-suggestion-spec: ensure-specs-dir
	echo "Downloading Suggestion API spec..."; \
	curl -fL -o $(SUGGESTION_SPEC_FILE) $(SUGGESTION_SPEC_URL); \

download-user-spec: ensure-specs-dir
	echo "Downloading User API spec..."; \
	curl -fL -o $(USER_SPEC_FILE) $(USER_SPEC_URL); \

download-all-specs: download-crm-spec download-employee-spec download-notification-spec download-resource-spec download-sale-spec download-suggestion-spec download-user-spec
	echo "All API specs downloaded successfully!"

# generate

generate-merged-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating merged API code..."
	rm -rf $(MERGED_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(MERGED_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -c $(CONFIG_FILE) \
	   -p pubName=$(MERGED_PUB_NAME) \
	   -o $(MERGED_OUTPUT_DIR)

generate-crm-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating CRM API code..."
	rm -rf $(CRM_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(CRM_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -c $(CONFIG_FILE) \
	   -p pubName=$(CRM_PUB_NAME) \
	   -o $(CRM_OUTPUT_DIR)

generate-employee-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating Employee API code..."
	rm -rf $(EMPLOYEE_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(EMPLOYEE_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -c $(CONFIG_FILE) \
	   -p pubName=$(EMPLOYEE_PUB_NAME) \
	   -o $(EMPLOYEE_OUTPUT_DIR)

generate-notification-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating Notification API code..."
	rm -rf $(NOTIFICATION_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(NOTIFICATION_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -c $(CONFIG_FILE) \
	   -p pubName=$(NOTIFICATION_PUB_NAME) \
	   -o $(NOTIFICATION_OUTPUT_DIR)

generate-resource-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating Resource API code..."
	rm -rf $(RESOURCE_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(RESOURCE_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -c $(CONFIG_FILE) \
	   -p pubName=$(RESOURCE_PUB_NAME) \
	   -o $(RESOURCE_OUTPUT_DIR)

generate-sale-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating Sale API code..."
	rm -rf $(SALE_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(SALE_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -c $(CONFIG_FILE) \
	   -p pubName=$(SALE_PUB_NAME) \
	   -o $(SALE_OUTPUT_DIR)

generate-suggestion-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating Suggestion API code..."
	rm -rf $(SUGGESTION_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(SUGGESTION_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -c $(CONFIG_FILE) \
	   -p pubName=$(SUGGESTION_PUB_NAME) \
	   -o $(SUGGESTION_OUTPUT_DIR)

generate-user-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating User API code..."
	rm -rf $(USER_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(USER_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -c $(CONFIG_FILE) \
	   -p pubName=$(USER_PUB_NAME) \
	   -o $(USER_OUTPUT_DIR)

# generate and pub get

generate-merged-api-and-pub-get: generate-merged-api
	cd $(MERGED_OUTPUT_DIR) && flutter pub get

generate-all-apis: generate-crm-api generate-employee-api generate-notification-api generate-resource-api generate-sale-api generate-suggestion-api generate-user-api
	echo "All API code generated successfully!"

generate-crm-api-and-pub-get: generate-crm-api
	cd $(CRM_OUTPUT_DIR) && flutter pub get

generate-employee-api-and-pub-get: generate-employee-api
	cd $(EMPLOYEE_OUTPUT_DIR) && flutter pub get

generate-notification-api-and-pub-get: generate-notification-api
	cd $(NOTIFICATION_OUTPUT_DIR) && flutter pub get

generate-resource-api-and-pub-get: generate-resource-api
	cd $(RESOURCE_OUTPUT_DIR) && flutter pub get

generate-sale-api-and-pub-get: generate-sale-api
	cd $(SALE_OUTPUT_DIR) && flutter pub get

generate-suggestion-api-and-pub-get: generate-suggestion-api
	cd $(SUGGESTION_OUTPUT_DIR) && flutter pub get

generate-user-api-and-pub-get: generate-user-api
	cd $(USER_OUTPUT_DIR) && flutter pub get

generate-all-apis-and-pub-get: generate-all-apis
	cd $(CRM_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(EMPLOYEE_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(NOTIFICATION_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(RESOURCE_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(SALE_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(SUGGESTION_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(USER_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	echo "All APIs generated and dependencies installed!"

# fetch and generate and pub get

fetch-and-generate-merged-api-and-pub-get: download-merged-spec generate-merged-api
	cd $(MERGED_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs

fetch-and-generate-crm-api-and-pub-get: download-crm-spec generate-crm-api
	cd $(CRM_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs

fetch-and-generate-employee-api-and-pub-get: download-employee-spec generate-employee-api
	cd $(EMPLOYEE_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs

fetch-and-generate-notification-api-and-pub-get: download-notification-spec generate-notification-api
	cd $(NOTIFICATION_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs

fetch-and-generate-resource-api-and-pub-get: download-resource-spec generate-resource-api
	cd $(RESOURCE_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs

fetch-and-generate-sale-api-and-pub-get: download-sale-spec generate-sale-api
	cd $(SALE_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs

fetch-and-generate-suggestion-api-and-pub-get: download-suggestion-spec generate-suggestion-api
	cd $(SUGGESTION_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs

fetch-and-generate-user-api-and-pub-get: download-user-spec generate-user-api
	cd $(USER_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs

fetch-and-generate-all-apis-and-pub-get: download-all-specs generate-all-apis
	cd $(CRM_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(EMPLOYEE_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(NOTIFICATION_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(RESOURCE_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(SALE_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(SUGGESTION_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	cd $(USER_OUTPUT_DIR) && flutter pub get && dart run build_runner build --delete-conflicting-outputs
	echo "All APIs fetched, generated, and dependencies installed!"

pub-get-all-modules:
	@for dir in ./modules/* ; do \
		if [ -d "$$dir" ]; then \
			echo "Entering $$dir..."; \
			(cd "$$dir" && flutter pub get) || exit 1; \
		fi; \
	done
	@echo "Pub get completed for all modules."
