OPENAPI_CODEGEN_VERSION := 7.20.0
OPENAPI_CODEGEN_JAR := ./openapi-generator-cli-$(OPENAPI_CODEGEN_VERSION).jar
GENERATOR := typescript-axios
SPECS_DIR := ./openapi-specs
GENERATED_DIR := ./src/modules/generated

MERGED_SPEC_URL := http://localhost:8080/gateway/v3/api-docs/merged
MERGED_SPEC_FILE := $(SPECS_DIR)/merged-api-spec.json
MERGED_PACKAGE_NAME := openapi_merged
MERGED_OUTPUT_DIR := $(GENERATED_DIR)/$(MERGED_PACKAGE_NAME)

CRM_SPEC_URL := http://localhost:8080/crm/v3/api-docs
CRM_SPEC_FILE := $(SPECS_DIR)/crm-api-spec.json
CRM_PACKAGE_NAME := openapi_crm
CRM_OUTPUT_DIR := $(GENERATED_DIR)/$(CRM_PACKAGE_NAME)

EMPLOYEE_SPEC_URL := http://localhost:8080/employee/v3/api-docs
EMPLOYEE_SPEC_FILE := $(SPECS_DIR)/employee-api-spec.json
EMPLOYEE_PACKAGE_NAME := openapi_employee
EMPLOYEE_OUTPUT_DIR := $(GENERATED_DIR)/$(EMPLOYEE_PACKAGE_NAME)

NOTIFICATION_SPEC_URL := http://localhost:8080/notification/v3/api-docs
NOTIFICATION_SPEC_FILE := $(SPECS_DIR)/notification-api-spec.json
NOTIFICATION_PACKAGE_NAME := openapi_notification
NOTIFICATION_OUTPUT_DIR := $(GENERATED_DIR)/$(NOTIFICATION_PACKAGE_NAME)

GENERATOR_OPTIONS := supportsES6=true,typescriptThreePlus=true,useSingleRequestParameter=true,withInterfaces=true
GLOBAL_PROPERTIES := apiDocs=false,modelDocs=false,apiTests=false,modelTests=false

.PHONY: \
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

download-openapi-cli-if-not-exists:
	# Check if the OpenAPI Generator CLI jar file exists, and download it if it doesn't
	if [ ! -f $(OPENAPI_CODEGEN_JAR) ]; then \
	    echo "OpenAPI Generator CLI not found. Downloading..."; \
	    curl -fL -o $(OPENAPI_CODEGEN_JAR) https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/$(OPENAPI_CODEGEN_VERSION)/openapi-generator-cli-$(OPENAPI_CODEGEN_VERSION).jar; \
	else \
	    echo "OpenAPI Generator CLI already exists."; \
	fi

ensure-specs-dir:
	mkdir -p $(SPECS_DIR)
	mkdir -p $(GENERATED_DIR)

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

download-all-specs: download-merged-spec download-crm-spec download-employee-spec download-notification-spec

# generate

generate-merged-api: download-openapi-cli-if-not-exists ensure-specs-dir
	echo "Generating merged API code..."
	rm -rf $(MERGED_OUTPUT_DIR)
	java -jar $(OPENAPI_CODEGEN_JAR) generate \
	   -i $(MERGED_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -o $(MERGED_OUTPUT_DIR) \
	   --global-property $(GLOBAL_PROPERTIES) \
	   --additional-properties=$(GENERATOR_OPTIONS),npmName=$(MERGED_PACKAGE_NAME)

generate-crm-api: download-openapi-cli-if-not-exists ensure-specs-dir
	echo "Generating CRM API code..."
	rm -rf $(CRM_OUTPUT_DIR)
	java -jar $(OPENAPI_CODEGEN_JAR) generate \
	   -i $(CRM_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -o $(CRM_OUTPUT_DIR) \
	   --global-property $(GLOBAL_PROPERTIES) \
	   --additional-properties=$(GENERATOR_OPTIONS),npmName=$(CRM_PACKAGE_NAME)

generate-employee-api: download-openapi-cli-if-not-exists ensure-specs-dir
	echo "Generating Employee API code..."
	rm -rf $(EMPLOYEE_OUTPUT_DIR)
	java -jar $(OPENAPI_CODEGEN_JAR) generate \
	   -i $(EMPLOYEE_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -o $(EMPLOYEE_OUTPUT_DIR) \
	   --global-property $(GLOBAL_PROPERTIES) \
	   --additional-properties=$(GENERATOR_OPTIONS),npmName=$(EMPLOYEE_PACKAGE_NAME)

generate-notification-api: download-openapi-cli-if-not-exists ensure-specs-dir
	echo "Generating Notification API code..."
	rm -rf $(NOTIFICATION_OUTPUT_DIR)
	java -jar $(OPENAPI_CODEGEN_JAR) generate \
	   -i $(NOTIFICATION_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -o $(NOTIFICATION_OUTPUT_DIR) \
	   --global-property $(GLOBAL_PROPERTIES) \
	   --additional-properties=$(GENERATOR_OPTIONS),npmName=$(NOTIFICATION_PACKAGE_NAME)

# fetch and generate

fetch-and-generate-merged-api: download-merged-spec generate-merged-api

fetch-and-generate-crm-api: download-crm-spec generate-crm-api

fetch-and-generate-employee-api: download-employee-spec generate-employee-api

fetch-and-generate-notification-api: download-notification-spec generate-notification-api

fetch-and-generate-all-apis: download-all-specs generate-all-apis
	echo "All APIs fetched and generated!"

# generate

generate-all-apis: generate-crm-api generate-employee-api generate-notification-api
	echo "All API code generated successfully!"
