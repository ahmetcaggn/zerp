import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/settings/cubit_settings.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold_messenger.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenSettingsLanguage extends StatelessWidget {
  const ScreenSettingsLanguage({super.key});

  static const List<String> _languages = ['system', 'en', 'tr'];

  String _getLanguageName(BuildContext context, String code) {
    final t = context.t;
    switch (code) {
      case 'system':
        return t.settings.languages.system;
      case 'en':
        return t.settings.languages.en;
      case 'tr':
        return t.settings.languages.tr;
      default:
        return code;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;

    return AppScaffold(
      title: t.settings.languageTitle,
      body: BlocBuilder<CubitSettings, StateSettings>(
        builder: (context, state) {
          final currentLang = state is StateSettingsLoaded
              ? (state.currentLanguage ?? 'system')
              : 'system';

          return ListView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            children: [
              _ActiveLanguageCard(activeLang: currentLang),
              const SizedBox(height: 24),
              Text(
                t.settings.languageSubtitle,
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
                  itemCount: _languages.length,
                  separatorBuilder: (context, index) => Divider(
                    height: 1,
                    color: theme.dividerColor.withAlpha(40),
                  ),
                  itemBuilder: (context, index) {
                    final lang = _languages[index];
                    final isSelected = lang == currentLang;

                    return ListTile(
                      onTap: () async {
                        await context
                            .read<CubitSettings>()
                            .updateLanguage(lang);

                        if (context.mounted) {
                          AppScaffoldMessenger.of(context).showSuccess(
                            context.t.settings.languageSaveSuccess,
                          );
                        }
                      },
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
                      ),
                      title: Text(
                        _getLanguageName(context, lang),
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

class _ActiveLanguageCard extends StatelessWidget {
  const _ActiveLanguageCard({required this.activeLang});

  final String activeLang;

  String _getLanguageName(BuildContext context, String code) {
    final t = context.t;
    switch (code) {
      case 'system':
        return t.settings.languages.system;
      case 'en':
        return t.settings.languages.en;
      case 'tr':
        return t.settings.languages.tr;
      default:
        return code;
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
                  Icons.language_rounded,
                  color: theme.colorScheme.onPrimary,
                  size: 28,
                ),
                const SizedBox(width: 12),
                Text(
                  t.settings.language,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: theme.colorScheme.onPrimary.withAlpha(200),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              _getLanguageName(context, activeLang),
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
