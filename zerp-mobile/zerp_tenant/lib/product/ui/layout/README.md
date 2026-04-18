# Layout Module

Shared layout and shell-navigation components for the app.

## Architecture Overview

The app now uses an AutoRoute shell pattern:

- `RouteShell` is the main host route
- `ScreenShell` uses `AutoTabsRouter` to switch feature sections
- `AppMainScaffold` renders shared UI chrome (AppBar, Drawer slot, body)
- `AppDrawer` is callback-driven and highlights the active section

Feature screens (`dashboard`, `employee`, `menu`, `sale`, `stock`, `store`) are now **content pages** only. They no longer own the main scaffold.

## Folder Structure

```text
layout/
├── README.md
├── app_drawer.dart
├── app_main_scaffold.dart
└── screen_shell.dart
```

## Components

### `screen_shell.dart`

Shell host page (`@RoutePage`) for all main sections.

Responsibilities:
- Creates `AutoTabsRouter` with section routes
- Maps active tab index to AppBar title
- Injects `AppDrawer` into `AppMainScaffold`
- Handles section switching and settings navigation callbacks

Current section order in shell tabs:
1. Dashboard
2. Employees
3. Menu
4. Sales
5. Stock
6. Store

### `app_main_scaffold.dart`

Reusable scaffold container used by the shell.

Responsibilities:
- Renders app-level `Scaffold`
- Displays dynamic AppBar title
- Accepts injected `drawer`
- Hosts shell child content in `body`
- Supports optional scaffold features (FAB, bottom nav, etc.)

### `app_drawer.dart`

Drawer UI component with active section highlight.

Constructor contract:
- `activeIndex` - selected section index
- `onSelectSection(int index)` - shell callback for tab switch
- `onTapSettings()` - shell callback for pushing settings route

This keeps route logic in `ScreenShell` and keeps the drawer UI focused.

## Navigation Behavior

Main sections:
- Switching sections uses `tabsRouter.setActiveIndex(index)`
- Tapping the currently active section closes the drawer only
- Selected drawer item is highlighted via `ListTile.selected`

Settings:
- Settings is currently opened via `context.router.push(const RouteSettings())`
- It is not part of shell tab children

Auth:
- Auth remains standalone and outside shell section tabs

## Best Practices

1. Keep shell-level navigation logic in `ScreenShell`
2. Keep `AppDrawer` UI-only; use callbacks for actions
3. Keep section pages scaffold-free (content-focused)
4. Keep route list and title list in the same order
5. When adding a section, update:
   - Shell tab routes
   - Shell title mapping
   - Drawer items/index mapping

## Migration Notes

This layout replaces the previous per-screen scaffold + stack-manipulation approach (`pushAndPopUntil`, `replaceAll` fallback per drawer tap). The shell tabs model gives simpler navigation state and reliable selected-item highlighting without extra state management.
