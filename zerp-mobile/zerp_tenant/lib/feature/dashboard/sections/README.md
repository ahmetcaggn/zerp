# Dashboard Sections

Modular sections that compose the dashboard, each managing a specific operational domain.

## Folder Structure

```
sections/
├── employee_section/   # Employee operations section
├── menu_section/       # Menu management section
├── sale_section/       # Sales overview section
├── stock_section/      # Stock management section
└── store_section/      # Store operations section
```

## Organization Pattern

Each section follows a consistent structure:
- **cubit_section_*.dart** - Section-specific state management
- **state_section_*.dart** - State model definitions
- **section_*.dart** - Section UI widget

This modular approach allows independent development and testing of dashboard components.
