# UI Localization

Typed localization setup for reusable UI and feature-facing text.

## Stack

This project uses `slang` + `slang_flutter`.

- Source files: `assets/i18n/*.i18n.json`
- Config: `slang.yaml`
- Generated output: `lib/product/ui/localization/gen/strings*.g.dart`

## Purpose

Provides compile-time-safe translation keys (`context.t.*`) for:
- Shell titles and drawer labels
- Auth buttons and shared labels
- Feature placeholders and section labels

## File Structure

```text
product/ui/localization/
├── README.md
└── gen/
    ├── strings.g.dart
    ├── strings_en.g.dart
    └── strings_tr.g.dart

assets/i18n/
├── en.i18n.json
└── tr.i18n.json
```

## How It Is Wired

- `lib/main.dart`
  - initializes locale via `LocaleSettings.useDeviceLocaleSync()`
  - wraps app with `TranslationProvider`
- `lib/feature/app_root.dart`
  - uses `TranslationProvider.of(context).flutterLocale`
  - provides `supportedLocales` and delegates
  - uses localized app title via `context.t.app.name`

## Adding or Updating Strings

1. Add keys to `assets/i18n/en.i18n.json`
2. Mirror keys in `assets/i18n/tr.i18n.json`
3. Regenerate typed code:

```zsh
dart run slang
```

4. Use keys in UI:

```dart
Text(context.t.shell.dashboard)
```

## Commands

```zsh
# generate/update localization code
dart run slang

# show translation stats
dart run slang stats
```

## Notes

- Keep English (`en`) as base locale in `slang.yaml`
- Keep translation schemas aligned across locale files
- Do not manually edit generated `strings*.g.dart` files
