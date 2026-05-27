# Waiter Panel (Sale Feature) Implementation Plan

This plan details the implementation of the waiter panel inside the `zerp_tenant` mobile app under `lib/feature/sale`. The flow allows the user to select a shop, view its tables, and manage orders for specific tables, including importing customer cart orders via QR code/text code.

## User Feedback & Requirements Included
- **Cubit & State Structure**: Each Cubit file will include its respective State classes (they are not split into separate files). Different features (e.g. Sales, Tables, Table Order) will have separate Cubit files.
- **QR / Code Import**: Integrate the `mobile_scanner` package to allow camera QR scanning, and also support manual text code entry to import customer orders.
- **Product Selection**: Implement a product/category picker to allow manual selection and additions to the order.
- **Pagination & Search**: Implement pagination for the tables list, and add a search/filter feature using the `name.eq` filter.

## Proposed Changes

### 1. Service Layer & Package Dependencies
- **Add Packages**: Add `mobile_scanner` package to `pubspec.yaml`.
- **Create Services**: Implement `SaleService` extending `ServiceBase`. This service will handle fetching shops, tables (with pagination and name filters), orders, updating orders, and previewing public cart orders.

#### [NEW] [sale_service.dart](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/lib/product/service/sale/sale_service.dart)

---

### 2. Localization
- **Update i18n JSONs**: Add structure under the `sale` key for `dashboard`, `tables`, and `order`.

#### [MODIFY] [en.i18n.json](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/assets/i18n/en.i18n.json)
#### [MODIFY] [tr.i18n.json](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/assets/i18n/tr.i18n.json)

```json
{
  "sale": {
    "title": "Sales",
    "dashboard": {
      "selectShop": "Select Shop",
      "tables": "Tables",
      "cash": "Cash"
    },
    "tables": {
      "title": "Tables",
      "searchPlaceholder": "Search by table name...",
      "status": {
        "AVAILABLE": "Available",
        "OCCUPIED": "Occupied",
        "RESERVED": "Reserved",
        "OUT_OF_ORDER": "Out of Order"
      }
    },
    "order": {
      "title": "Table Order",
      "scanQr": "Scan QR",
      "enterCode": "Enter Code",
      "save": "Save Order"
    }
  }
}
```

---

### 3. Routing
- **App Route Update**: Register the new table list and table order screens.

#### [MODIFY] [app_route.dart](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/lib/product/navigation/app_route.dart)

---

### 4. Sale Feature Modules (Cubits & UI)

#### Sale Dashboard
Displays the shop selector and the "Tables" / "Cash" buttons.
- `cubit_sale.dart` contains `CubitSale` and `StateSale` classes.
#### [NEW] [cubit_sale.dart](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/lib/feature/sale/cubit/cubit_sale.dart)
#### [MODIFY] [screen_sale.dart](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/lib/feature/sale/screen_sale.dart)

#### Tables List (with Pagination & Search)
Fetches and displays the tables for a selected shop. Supports infinite scrolling pagination and name query (`name.eq`).
- `cubit_tables.dart` contains `CubitTables` and `StateTables` classes.
#### [NEW] [cubit_tables.dart](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/lib/feature/sale/cubit/cubit_tables.dart)
#### [NEW] [screen_tables.dart](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/lib/feature/sale/view/screen_tables.dart)
#### [NEW] [table_card.dart](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/lib/feature/sale/view/widget/table_card.dart)

#### Table Order & Scanning
Handles order updates, QR code scanning (`mobile_scanner`), manual text code importing, and product selection.
- `cubit_table_order.dart` contains `CubitTableOrder` and `StateTableOrder` classes.
#### [NEW] [cubit_table_order.dart](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/lib/feature/sale/cubit/cubit_table_order.dart)
#### [NEW] [screen_table_order.dart](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/lib/feature/sale/view/screen_table_order.dart)
#### [NEW] [order_item_list.dart](file:///Users/femrek/projects/exclusive/zerp/zerp-mobile/zerp_tenant/lib/feature/sale/view/widget/order_item_list.dart)

## Verification Plan

### Automated Tests
- Build and auto-generation checks: run `dart run build_runner build -d` and `dart run slang`.

### Manual Verification
- Verify Sales navigation and shop selector.
- Verify Tables screen lists tables, performs search/filtering, and handles scroll-based pagination.
- Verify table order creation, QR camera scanning modal, manual code entry, and adding products using the product picker.
