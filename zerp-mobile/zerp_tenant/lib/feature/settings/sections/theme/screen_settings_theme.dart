import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/settings/cubit_settings.dart';
import 'package:zerp_tenant/product/storage/model/settings.storage_model.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold_messenger.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenSettingsTheme extends StatelessWidget {
  const ScreenSettingsTheme({super.key});

  String _getThemeName(BuildContext context, AppThemeMode mode) {
    final t = context.t;
    switch (mode) {
      case AppThemeMode.system:
        return t.settings.themes.system;
      case AppThemeMode.light:
        return t.settings.themes.light;
      case AppThemeMode.dark:
        return t.settings.themes.dark;
    }
  }

  IconData _getThemeIcon(AppThemeMode mode) {
    switch (mode) {
      case AppThemeMode.system:
        return Icons.settings_brightness_rounded;
      case AppThemeMode.light:
        return Icons.light_mode_rounded;
      case AppThemeMode.dark:
        return Icons.dark_mode_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;

    return AppScaffold(
      title: t.settings.themeTitle,
      body: BlocBuilder<CubitSettings, StateSettings>(
        builder: (context, state) {
          final currentTheme = state is StateSettingsLoaded
              ? state.currentThemeMode
              : AppThemeMode.system;

          return ListView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            children: [
              _ActiveThemeCard(activeTheme: currentTheme),
              const SizedBox(height: 24),
              Text(
                t.settings.themeSubtitle,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.textTheme.bodyMedium?.color?.withAlpha(180),
                ),
              ),
              const SizedBox(height: 16),
              Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(
                    color: theme.dividerColor.withAlpha(50),
                  ),
                ),
                color: theme.cardColor,
                clipBehavior: Clip.antiAlias,
                child: ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: AppThemeMode.values.length,
                  separatorBuilder: (context, index) => Divider(
                    height: 1,
                    color: theme.dividerColor.withAlpha(40),
                  ),
                  itemBuilder: (context, index) {
                    final themeMode = AppThemeMode.values[index];
                    final isSelected = themeMode == currentTheme;

                    return ListTile(
                      onTap: () async {
                        await context
                            .read<CubitSettings>()
                            .updateTheme(themeMode);

                        if (context.mounted) {
                          AppScaffoldMessenger.of(context).showSuccess(
                            context.t.settings.themeSaveSuccess,
                          );
                        }
                      },
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
                      ),
                      leading: Icon(
                        _getThemeIcon(themeMode),
                        color: isSelected
                            ? theme.colorScheme.primary
                            : theme.iconTheme.color?.withAlpha(150),
                      ),
                      title: Text(
                        _getThemeName(context, themeMode),
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: isSelected
                              ? FontWeight.bold
                              : FontWeight.normal,
                          color: isSelected
                              ? theme.colorScheme.primary
                              : theme.textTheme.titleMedium?.color,
                        ),
                      ),
                      trailing: isSelected
                          ? Icon(
                              Icons.check_circle_rounded,
                              color: theme.colorScheme.primary,
                            )
                          : null,
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _ActiveThemeCard extends StatelessWidget {
  const _ActiveThemeCard({required this.activeTheme});

  final AppThemeMode activeTheme;

  String _getThemeName(BuildContext context, AppThemeMode code) {
    final t = context.t;
    switch (code) {
      case AppThemeMode.system:
        return t.settings.themes.system;
      case AppThemeMode.light:
        return t.settings.themes.light;
      case AppThemeMode.dark:
        return t.settings.themes.dark;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;

    return Card(
      elevation: 4,
      shadowColor: theme.colorScheme.primary.withAlpha(50),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      clipBehavior: Clip.antiAlias,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              theme.colorScheme.primary,
              theme.colorScheme.primaryContainer,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.palette_rounded,
                  color: theme.colorScheme.onPrimary,
                  size: 28,
                ),
                const SizedBox(width: 12),
                Text(
                  t.settings.theme,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: theme.colorScheme.onPrimary.withAlpha(200),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              _getThemeName(context, activeTheme),
              style: theme.textTheme.headlineMedium?.copyWith(
                color: theme.colorScheme.onPrimary,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
