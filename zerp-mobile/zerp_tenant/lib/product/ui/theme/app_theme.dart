import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/ui/theme/color_schema.dart';

abstract final class AppTheme {
  static ThemeData light() {
    final colorScheme = ColorScheme.fromSeed(seedColor: AppColorSchema.seed);
    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: AppColorSchema.lightBackground,
      cardColor: AppColorSchema.lightSurface,
    );
  }

  static ThemeData dark() {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppColorSchema.seed,
      brightness: Brightness.dark,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: AppColorSchema.darkBackground,
      cardColor: AppColorSchema.darkSurface,
    );
  }
}
