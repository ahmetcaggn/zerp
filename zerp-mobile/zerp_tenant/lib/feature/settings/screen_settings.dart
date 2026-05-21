import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/settings/cubit_settings.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenSettings extends StatelessWidget {
  const ScreenSettings({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;

    return AppScaffold(
      title: t.settings.title,
      body: BlocBuilder<CubitSettings, StateSettings>(
        builder: (context, state) {
          final currentApiHost = state is StateSettingsLoaded
              ? (state.currentApiHost ?? '...')
              : '...';

          return ListView(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
            children: [
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
                child: ListTile(
                  onTap: () {
                    unawaited(
                      context.router.push(const RouteSettingsApiBaseUrl()),
                    );
                  },
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  leading: CircleAvatar(
                    backgroundColor: theme.colorScheme.primary.withAlpha(20),
                    child: Icon(
                      Icons.dns_rounded,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  title: Text(
                    t.settings.apiUrlTitle,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 6),
                    child: Text(
                      currentApiHost,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color:
                            theme.textTheme.bodyMedium?.color?.withAlpha(180),
                      ),
                    ),
                  ),
                  trailing: Icon(
                    Icons.chevron_right_rounded,
                    color: theme.iconTheme.color?.withAlpha(150),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
