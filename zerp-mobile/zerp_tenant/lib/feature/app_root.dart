import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/app_messenger/cubit_app_messenger.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/cubit_error.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/network_indicator/cubit_network_indicator.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/permission/cubit_permission.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/settings/cubit_settings.dart';
import 'package:zerp_tenant/product/navigation/app_route.dart';
import 'package:zerp_tenant/product/storage/model/settings.storage_model.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';
import 'package:zerp_tenant/product/ui/theme/app_theme.dart';
import 'package:zerp_tenant/product/ui/widget/error_overlay.dart';
import 'package:zerp_tenant/product/ui/widget/permission/permission_scope.dart';

class AppRoot extends StatelessWidget with LoggerMixinConst<AppRoot> {
  const AppRoot({super.key});

  @override
  Widget build(BuildContext context) {
    final appRouter = getIt<AppRoute>();

    return TranslationProvider(
      child: MultiBlocProvider(
        providers: [
          BlocProvider(create: (_) => getIt<CubitAuth>()),
          BlocProvider(create: (_) => getIt<CubitError>()),
          BlocProvider(create: (_) => getIt<CubitAppMessenger>()),
          BlocProvider(create: (_) => getIt<CubitSettings>()),
          BlocProvider(create: (_) => getIt<CubitOrganizationScope>()),
          BlocProvider(create: (_) => getIt<CubitPermission>()),
          BlocProvider(create: (_) => getIt<CubitNetworkIndicator>()),
        ],
        child: BlocBuilder<CubitSettings, StateSettings>(
          builder: (context, state) {
            final ThemeMode themeMode;
            if (state is StateSettingsLoaded) {
              switch (state.currentThemeMode) {
                case AppThemeMode.light:
                  themeMode = ThemeMode.light;
                case AppThemeMode.dark:
                  themeMode = ThemeMode.dark;
                case AppThemeMode.system:
                  themeMode = ThemeMode.system;
              }
            } else {
              themeMode = ThemeMode.system;
            }

            return MaterialApp.router(
              locale: TranslationProvider.of(context).flutterLocale,
              supportedLocales: AppLocaleUtils.supportedLocales,
              localizationsDelegates: GlobalMaterialLocalizations.delegates,
              onGenerateTitle: (context) => context.t.app.name,
              debugShowCheckedModeBanner: false,
              theme: AppTheme.light(),
              darkTheme: AppTheme.dark(),
              themeMode: themeMode,
              routerConfig: appRouter.config(),
              builder: (context, child) {
                return Stack(
                  children: [
                    PermissionScopeProvider(
                      child: child ?? const SizedBox.shrink(),
                    ),
                    const ErrorOverlay(),
                  ],
                );
              },
            );
          },
        ),
      ),
    );
  }
}
