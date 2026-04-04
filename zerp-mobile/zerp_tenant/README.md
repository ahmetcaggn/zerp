# zerp_tenant

## Folder Structure

### main structure

- lib
  - test
    - keys
  - feature
    - example
      - cubit
        - cubit_example.dart
        - state_example.dart
      - view
        - screen_example.dart
    - splash
    - login
    - dashboard
      - sections
        - example_section
          - cubit
          - view
        - stock_section
        - employee_section
        - sale_section
        - store_section
        - menu_section
      - view
      - cubit
    - stock
    - employee
    - sale
    - store
    - menu
    - settings
  - product
    - localization
    - navigation
    - init
    - service
    - network
    - storage
      - storage_initializer.dart
      - operator
        - storage_operator_example.dart
      - model
        - storage_model_example.dart
      - core
        - storage_base_model.dart
        - storage_model.dart (StorageModel<T extends StorageBaseModel>) (has T and StorageMetadataModel fields)
        - storage_metadata_model.dart
        - storage_operator.dart
    - ui
      - theme
      - widget
      - localization
  - main.dart

### Modules

- zerp_tenant
  - lib
  - modules
    - openapi (will be added in future)
