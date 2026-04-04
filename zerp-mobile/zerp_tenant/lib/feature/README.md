# Feature Module

Contains all feature-specific modules, each implementing distinct business logic and user-facing functionality.

## Folder Structure

```
feature/
├── dashboard/          # Dashboard feature with sectioned views
├── employee/           # Employee management feature
├── login/              # Authentication feature
├── menu/               # Menu management feature
├── sale/               # Sales transactions feature
├── settings/           # Application settings feature
├── splash/             # Splash screen feature
├── stock/              # Stock management feature
└── store/              # Store management feature
```

## Organization Pattern

Each feature folder follows a consistent structure:
- **cubit/** - State management
- **view/** - UI presentation layers

Special case:
- **dashboard/** - Contains additional `sections/` for modular sub-features
