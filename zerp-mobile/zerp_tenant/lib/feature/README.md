# Feature Module

Contains all feature-specific modules, each implementing distinct business logic and user-facing functionality for the
Zerp Tenant application. This module is organized following a modular architecture pattern to ensure scalability,
maintainability, and code reusability.

## Overview

The feature module is the core of the application's business logic and presentation layers. Each feature is designed to
be self-contained with its own state management, UI components, and internal dependencies. This modular approach allows
for:

- **Independent Development**: Features can be developed and tested independently
- **Easy Maintenance**: Changes to one feature don't affect others
- **Code Reusability**: Shared logic can be extracted and used across features
- **Scalability**: New features can be added without disrupting existing code

## Folder Structure

```
feature/
├── app_root.dart              # Root application configuration
├── auth/                      # Authentication feature
│   ├── README.md
│   ├── cubit/                 # State management for auth
│   └── view/                  # UI screens for login/authentication
├── dashboard/                 # Dashboard feature with sectioned views
│   ├── README.md
│   ├── cubit/                 # State management for dashboard
│   ├── view/                  # Dashboard UI components
│   └── sections/              # Modular dashboard sections
│       ├── README.md
│       ├── employee_section/  # Employee overview section
│       ├── menu_section/      # Menu overview section
│       ├── sale_section/      # Sales overview section
│       ├── stock_section/     # Stock overview section
│       └── store_section/     # Store overview section
├── employee/                  # Employee management feature
│   ├── README.md
│   ├── cubit/                 # State management for employee module
│   └── view/                  # UI screens for employee management
├── menu/                      # Menu management feature
│   ├── README.md
│   ├── cubit/                 # State management for menu module
│   └── view/                  # UI screens for menu management
├── sale/                      # Sales transactions feature
│   ├── README.md
│   ├── cubit/                 # State management for sales module
│   └── view/                  # UI screens for sales management
├── settings/                  # Application settings feature
│   ├── README.md
│   ├── cubit/                 # State management for settings
│   └── view/                  # UI screens for settings
├── stock/                     # Stock management feature
│   ├── README.md
│   ├── cubit/                 # State management for stock module
│   └── view/                  # UI screens for stock management
└── store/                     # Store management feature
    ├── README.md
    ├── cubit/                 # State management for store module
    └── view/                  # UI screens for store management
```

## Architecture Pattern

### Organization Structure

Each feature folder follows a consistent and predictable structure:

#### Standard Feature Structure

```
feature_name/
├── README.md          # Feature documentation
├── cubit/             # State management layer (BLoC/Cubit)
│   ├── *_cubit.dart   # Cubit implementation
│   ├── *_state.dart   # State classes
│   └── *_event.dart   # Event/Action classes (if using BLoC)
└── view/              # Presentation layer
    ├── screens/       # Full-page screens
    ├── widgets/       # Reusable UI components
    └── pages/         # Complex page compositions
```

### State Management

- **Cubit Pattern**: Used for simple to moderate state management
- **Location**: Each feature's `cubit/` folder contains all state management logic
- **Responsibilities**: Handles business logic, data fetching, and state transitions

### UI Presentation

- **View Layer**: Located in `view/` folder
- **Structure**: Organized into screens, widgets, and pages
- **Principles**:
    - Widgets are stateless when possible
    - Use Cubit/BLoC for state management
    - Keep UI logic minimal, delegate to Cubit
- **Scaffold Usage**: Use `AppMainScaffold` from the layout package for consistent layout across all screens (except
  auth and settings)

## Layout Package

The application uses a custom `AppMainScaffold` component from the product UI widget library (
`product/ui/widget/scaffold/`) to provide a consistent and standardized layout structure across screens.

### AppMainScaffold Features

- **Consistent Design**: Ensures uniform layout patterns across the entire application
- **Flexible Components**: Supports app bars, FAB, drawers, and bottom navigation
- **Centralized Styling**: Any global layout changes can be made in one place
- **Standardized Behavior**: Provides predictable behavior across all main screens

### Screens Using AppMainScaffold

- ✅ Dashboard
- ✅ Employee
- ✅ Menu
- ✅ Sale
- ✅ Stock
- ✅ Store

### Screens Excluded (Using Standard Scaffold)

- ❌ Authentication (custom layout requirements)
- ❌ Settings (standalone configuration screen)

### Usage Example

```dart
import 'package:zerp_tenant/product/ui/layout/app_main_scaffold.dart';

class ScreenDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const AppMainScaffold(
      title: 'Dashboard',
      body: Center(
        child: Text('Dashboard Content'),
      ),
    );
  }
}
```

### Key Features of AppMainScaffold

1. **Fixed AppBar**: Automatically displays with a hamburger icon for drawer navigation
   - Title is dynamic - pass your screen title as a required parameter
   - Includes elevation for visual hierarchy

2. **Fixed Drawer Menu**: Provides consistent navigation across all screens
   - Menu items for all major features (Dashboard, Employees, Menu, Sales, Stock, Store)
   - Settings option at the bottom
   - Uses Material Design icons for visual recognition
   - Auto-closes on navigation

3. **Flexible Body**: Use the `body` parameter for your screen content

4. **Optional Components**: Still supports:
   - Floating Action Button (FAB)
   - Bottom Navigation Bar
   - Custom Background Color
   - Keyboard handling

## Special Cases

### Dashboard Feature

The dashboard feature has an extended structure with `sections/`:

- Contains **5 main sections**: employee, menu, sale, stock, and store
- Each section provides a quick overview of its respective feature
- Sections are independently manageable and can be updated without affecting the main dashboard
- Useful for creating modular dashboard widgets that summarize key information

## Development Guidelines

1. **Feature Isolation**: Keep feature code isolated from other features
2. **Naming Conventions**: Use consistent naming for Cubits, States, and Views
3. **Documentation**: Each feature should have a README.md explaining its purpose and usage
4. **Dependencies**: Use dependency injection or provide patterns to manage dependencies
5. **Testing**: Write unit tests for Cubits and widget tests for Views

## Adding a New Feature

To add a new feature:

1. Create a new folder in `feature/` with the feature name
2. Add a `README.md` documenting the feature
3. Create `cubit/` folder with state management logic
4. Create `view/` folder with UI components
5. Follow the established naming conventions and patterns

## Related Files

- `app_root.dart` - Root configuration and navigation setup for all features
