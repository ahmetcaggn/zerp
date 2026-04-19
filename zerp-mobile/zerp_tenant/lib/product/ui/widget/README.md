# Widget Library

Reusable UI widgets and components shared across features.

## Purpose

Provides a collection of common widgets and components used throughout the application, ensuring consistency and reducing duplication.

## Folder Structure

```
widget/
├── README.md                    # This file
```

## Note on Layout Components

The main scaffold component `AppMainScaffold` has been moved to `product/ui/layout/` for better organization. 

See documentation below for how to use it in your screens:

### AppMainScaffold
The main scaffold widget used across the application for consistent layout with fixed AppBar and Drawer.

**Location:** `lib/product/ui/layout/app_main_scaffold.dart`

**Usage:**
```dart
import 'package:zerp_tenant/product/ui/layout/app_main_scaffold.dart';

class MyScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const AppMainScaffold(
      title: 'My Screen',
      body: Center(child: Text('Content')),
    );
  }
}
```

**Required Parameters:**
- `title` (required): The title displayed in the AppBar (dynamic per screen)
- `body` (required): The main content widget

**Optional Parameters:**
- `floatingActionButton`: Optional FAB
- `floatingActionButtonLocation`: Location of the FAB
- `endDrawer`: Optional end drawer
- `bottomNavigationBar`: Optional bottom navigation bar
- `bottomSheet`: Optional bottom sheet
- `backgroundColor`: Custom background color
- `resizeToAvoidBottomInset`: Resize behavior for keyboard
- `primary`: Whether this is the primary scaffold

## Features

- **Fixed AppBar**: Displays screen title with hamburger menu icon
- **Fixed Drawer**: Includes navigation menu for all features (Dashboard, Employees, Menu, Sales, Stock, Store, Settings)
- **Material Design**: Uses Flutter's Material Design principles
- **Navigation Ready**: Drawer menu items handle navigation automatically

## Guidelines

1. Use `AppMainScaffold` for all screens except auth and settings
2. Always provide a descriptive `title` parameter
3. Keep body content clean and focused
4. Use drawer menu for navigation (don't create custom navigation)
