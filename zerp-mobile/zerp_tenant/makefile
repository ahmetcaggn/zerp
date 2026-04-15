OPENAPI_CODEGEN_VERSION := 7.20.0
OPENAPI_CODEGEN_JAR := ./openapi-generator-cli-$(OPENAPI_CODEGEN_VERSION).jar
CUSTOM_CODEGEN_VERSION := 0.1.9
CUSTOM_CODEGEN_JAR := ./openapi-dart-network-codegen-$(CUSTOM_CODEGEN_VERSION).jar
GENERATOR := dart-network
SPECS_DIR := ./openapi-specs

MERGED_SPEC_URL=http://localhost:8080/gateway/v3/api-docs/merged
MERGED_SPEC_FILE=$(SPECS_DIR)/merged-api-spec.json
MERGED_PUB_NAME=openapi_merged
MERGED_OUTPUT_DIR=./modules/$(MERGED_PUB_NAME)

CRM_SPEC_URL := http://localhost:8080/crm/v3/api-docs
CRM_SPEC_FILE := $(SPECS_DIR)/crm-api-spec.json
CRM_PUB_NAME := openapi_crm
CRM_OUTPUT_DIR := ./modules/$(CRM_PUB_NAME)

EMPLOYEE_SPEC_URL := http://localhost:8080/employee/v3/api-docs
EMPLOYEE_SPEC_FILE := $(SPECS_DIR)/employee-api-spec.json
EMPLOYEE_PUB_NAME := openapi_employee
EMPLOYEE_OUTPUT_DIR := ./modules/$(EMPLOYEE_PUB_NAME)

NOTIFICATION_SPEC_URL := http://localhost:8080/notification/v3/api-docs
NOTIFICATION_SPEC_FILE := $(SPECS_DIR)/notification-api-spec.json
NOTIFICATION_PUB_NAME := openapi_notification
NOTIFICATION_OUTPUT_DIR := ./modules/$(NOTIFICATION_PUB_NAME)

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

download-all-specs: download-crm-spec download-employee-spec download-notification-spec

# generate

generate-merged-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating merged API code..."
	rm -rf $(MERGED_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(MERGED_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -p pubName=$(MERGED_PUB_NAME) \
	   -o $(MERGED_OUTPUT_DIR)

generate-crm-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating CRM API code..."
	rm -rf $(CRM_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(CRM_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -p pubName=$(CRM_PUB_NAME) \
	   -o $(CRM_OUTPUT_DIR)

generate-employee-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating Employee API code..."
	rm -rf $(EMPLOYEE_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(EMPLOYEE_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -p pubName=$(EMPLOYEE_PUB_NAME) \
	   -o $(EMPLOYEE_OUTPUT_DIR)

generate-notification-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists
	echo "Generating Notification API code..."
	rm -rf $(NOTIFICATION_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(NOTIFICATION_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -p pubName=$(NOTIFICATION_PUB_NAME) \
	   -o $(NOTIFICATION_OUTPUT_DIR)

# fetch and generate and pub get

fetch-and-generate-merged-api-and: download-merged-spec generate-merged-api
	cd $(MERGED_OUTPUT_DIR) && flutter pub get

fetch-and-generate-crm-api: download-crm-spec generate-crm-api
	cd $(CRM_OUTPUT_DIR) && flutter pub get

fetch-and-generate-employee-api: download-employee-spec generate-employee-api
	cd $(EMPLOYEE_OUTPUT_DIR) && flutter pub get

fetch-and-generate-notification-api: download-notification-spec generate-notification-api
	cd $(NOTIFICATION_OUTPUT_DIR) && flutter pub get

fetch-and-generate-all-apis: download-all-specs generate-all-apis
	cd $(CRM_OUTPUT_DIR) && flutter pub get
	cd $(EMPLOYEE_OUTPUT_DIR) && flutter pub get
	cd $(NOTIFICATION_OUTPUT_DIR) && flutter pub get
	echo "All APIs fetched, generated, and dependencies installed!"

# generate and pub get

generate-merged-api-and-pub-get: generate-merged-api
	cd $(MERGED_OUTPUT_DIR) && flutter pub get

generate-all-apis: generate-crm-api generate-employee-api generate-notification-api
	echo "All API code generated successfully!"

generate-crm-api-and-pub-get: generate-crm-api
	cd $(CRM_OUTPUT_DIR) && flutter pub get

generate-employee-api-and-pub-get: generate-employee-api
	cd $(EMPLOYEE_OUTPUT_DIR) && flutter pub get

generate-notification-api-and-pub-get: generate-notification-api
	cd $(NOTIFICATION_OUTPUT_DIR) && flutter pub get

generate-all-apis-and-pub-get: generate-all-apis
	cd $(CRM_OUTPUT_DIR) && flutter pub get
	cd $(EMPLOYEE_OUTPUT_DIR) && flutter pub get
	cd $(NOTIFICATION_OUTPUT_DIR) && flutter pub get
	echo "All APIs generated and dependencies installed!"
