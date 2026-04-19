# Localization Module

Application-level localization configuration and lifecycle setup.

## Purpose

This folder contains localization bootstrap concerns used by app startup.

Runtime translations are managed with `slang` and generated into:
- `lib/product/ui/localization/gen/strings.g.dart`
- `lib/product/ui/localization/gen/strings_en.g.dart`
- `lib/product/ui/localization/gen/strings_tr.g.dart`

## Current Setup

- Locale initialization happens in `AppInitializer` via `LocaleSettings.useDeviceLocaleSync()`
- `TranslationProvider` is applied in `AppRoot`
- UI code consumes typed keys through `context.t.*`

## Translation Sources

- `assets/i18n/en.i18n.json`
- `assets/i18n/tr.i18n.json`

## Commands

```zsh
dart run slang
dart run slang stats
```
