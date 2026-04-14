OPENAPI_CODEGEN_VERSION := 7.20.0
OPENAPI_CODEGEN_JAR := ./openapi-generator-cli-$(OPENAPI_CODEGEN_VERSION).jar
CUSTOM_CODEGEN_VERSION := 0.1.9
CUSTOM_CODEGEN_JAR := ./openapi-dart-network-codegen-$(CUSTOM_CODEGEN_VERSION).jar
GENERATOR := dart-network

# Legacy spec file (kept for backward compatibility)
SPEC_FILE_NAME := ./openapi-spec.json
SPEC_FILE_URL := https://dummyapi.femrek.dev/v3/api-docs

# API configurations
APIS := crm employee notification
SPECS_DIR := ./openapi-specs

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

download-openapi-spec: ensure-specs-dir
	# Check if the OpenAPI spec file exists, and download it if it doesn't
	echo "OpenAPI spec file Downloading..."; \
	curl -fL -o $(SPEC_FILE_NAME) $(SPEC_FILE_URL); \

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

generate: download-openapi-cli-if-not-exists download-codegen-if-not-exists download-openapi-spec
	$(eval OUTPUT_DIR := ./modules/openapi)
	rm -rf $(OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(SPEC_FILE_NAME) \
	   -g $(GENERATOR) \
	   -o $(OUTPUT_DIR)

generate-crm-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists download-crm-spec
	echo "Generating CRM API code..."
	rm -rf $(CRM_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(CRM_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -p pubName=$(CRM_PUB_NAME) \
	   -o $(CRM_OUTPUT_DIR)

generate-employee-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists download-employee-spec
	echo "Generating Employee API code..."
	rm -rf $(EMPLOYEE_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(EMPLOYEE_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -p pubName=$(EMPLOYEE_PUB_NAME) \
	   -o $(EMPLOYEE_OUTPUT_DIR)

generate-notification-api: download-openapi-cli-if-not-exists download-codegen-if-not-exists download-notification-spec
	echo "Generating Notification API code..."
	rm -rf $(NOTIFICATION_OUTPUT_DIR)
	java -cp $(OPENAPI_CODEGEN_JAR):$(CUSTOM_CODEGEN_JAR) org.openapitools.codegen.OpenAPIGenerator generate \
	   -i $(NOTIFICATION_SPEC_FILE) \
	   -g $(GENERATOR) \
	   -p pubName=$(NOTIFICATION_PUB_NAME) \
	   -o $(NOTIFICATION_OUTPUT_DIR)

generate-all-apis: generate-crm-api generate-employee-api generate-notification-api
	echo "All API code generated successfully!"

generate-and-pub-get: generate
	$(eval OUTPUT_DIR := ./modules/openapi)
	cd $(OUTPUT_DIR) && flutter pub get

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
