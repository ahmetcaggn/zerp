import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/settings/cubit_settings.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenSettingsLoggingLevel extends StatelessWidget {
  const ScreenSettingsLoggingLevel({super.key});

  static const List<String> _levels = [
    'ALL',
    'FINEST',
    'FINER',
    'FINE',
    'CONFIG',
    'INFO',
    'WARNING',
    'SEVERE',
    'SHOUT',
    'OFF',
  ];

  String _getLevelDescription(BuildContext context, String level) {
    final t = context.t;
    switch (level) {
      case 'ALL':
        return t.settings.loggingLevelDescAll;
      case 'FINEST':
        return t.settings.loggingLevelDescFinest;
      case 'FINER':
        return t.settings.loggingLevelDescFiner;
      case 'FINE':
        return t.settings.loggingLevelDescFine;
      case 'CONFIG':
        return t.settings.loggingLevelDescConfig;
      case 'INFO':
        return t.settings.loggingLevelDescInfo;
      case 'WARNING':
        return t.settings.loggingLevelDescWarning;
      case 'SEVERE':
        return t.settings.loggingLevelDescSevere;
      case 'SHOUT':
        return t.settings.loggingLevelDescShout;
      case 'OFF':
        return t.settings.loggingLevelDescOff;
      default:
        return level;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;

    return AppScaffold(
      title: t.settings.loggingLevelTitle,
      body: BlocBuilder<CubitSettings, StateSettings>(
        builder: (context, state) {
          final currentLevel = state is StateSettingsLoaded
              ? (state.currentRemoteLogLevel ?? 'CONFIG')
              : 'CONFIG';

          return ListView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            children: [
              _ActiveLoggingLevelCard(activeLevel: currentLevel),
              const SizedBox(height: 24),
              Text(
                t.settings.loggingLevelSubtitle,
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
                  itemCount: _levels.length,
                  separatorBuilder: (context, index) => Divider(
                    height: 1,
                    color: theme.dividerColor.withAlpha(40),
                  ),
                  itemBuilder: (context, index) {
                    final level = _levels[index];
                    final isSelected = level == currentLevel;

                    return ListTile(
                      onTap: () async {
                        await context
                            .read<CubitSettings>()
                            .updateRemoteLogLevel(level);

                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(t.settings.loggingLevelSaveSuccess),
                              backgroundColor: Colors.green,
                              behavior: SnackBarBehavior.floating,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                          );
                        }
                      },
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 8,
                      ),
                      title: Text(
                        level,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: isSelected
                              ? FontWeight.bold
                              : FontWeight.normal,
                          color: isSelected
                              ? theme.colorScheme.primary
                              : theme.textTheme.titleMedium?.color,
                        ),
                      ),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          _getLevelDescription(context, level),
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.textTheme.bodySmall?.color?.withAlpha(
                              isSelected ? 220 : 150,
                            ),
                          ),
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

class _ActiveLoggingLevelCard extends StatelessWidget {
  const _ActiveLoggingLevelCard({required this.activeLevel});

  final String activeLevel;

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
                  Icons.terminal_rounded,
                  color: theme.colorScheme.onPrimary,
                  size: 28,
                ),
                const SizedBox(width: 12),
                Text(
                  t.settings.loggingLevel,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: theme.colorScheme.onPrimary.withAlpha(200),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              activeLevel,
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
