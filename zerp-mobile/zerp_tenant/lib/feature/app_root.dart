import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/state_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/cubit_error.dart';
import 'package:zerp_tenant/product/navigation/app_route.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';
import 'package:zerp_tenant/product/ui/theme/app_theme.dart';
import 'package:zerp_tenant/product/ui/widget/error_overlay.dart';

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
        ],
        child: BlocListener<CubitAuth, StateAuth>(
          listenWhen: (previous, current) =>
              current is StateAuthAuthenticated ||
              current is StateAuthUnauthenticated,
          listener: (context, state) {
            final currentPath = appRouter.current.path;
            final currentRouteName = appRouter.current.name;

            if (state is StateAuthAuthenticated &&
                currentRouteName != RouteDashboard.name) {
              if (currentRouteName == RouteAuth.name) {
                final args = appRouter.current.args as RouteAuthArgs?;
                final callerRoute = args?.callerRoute;
                if (callerRoute != null && callerRoute.isNotEmpty) {
                  unawaited(
                    appRouter
                        .replaceAll([const RouteDashboard()])
                        .then(
                          (_) => appRouter.pushPath(callerRoute),
                        ),
                  );
                  return;
                } else {
                  log.warning(
                    'User authenticated and on auth route, '
                    'but no callerRoute provided.',
                  );
                }
              }
              log.warning(
                'User authenticated but not on shell route. '
                'Current route: ${appRouter.current.name}',
              );
              unawaited(appRouter.replaceAll([const RouteDashboard()]));
            }

            if (state is StateAuthUnauthenticated &&
                currentRouteName != RouteAuth.name) {
              unawaited(
                appRouter.replaceAll([
                  RouteAuth(callerRoute: currentPath),
                ]),
              );
            }
          },
          child: Builder(
            builder: (context) {
              return MaterialApp.router(
                locale: TranslationProvider.of(context).flutterLocale,
                supportedLocales: AppLocaleUtils.supportedLocales,
                localizationsDelegates: GlobalMaterialLocalizations.delegates,
                onGenerateTitle: (context) => context.t.app.name,
                debugShowCheckedModeBanner: false,
                theme: AppTheme.light(),
                darkTheme: AppTheme.dark(),
                routerConfig: appRouter.config(),
                builder: (context, child) {
                  return Stack(
                    children: [
                      ?child,
                      const ErrorOverlay(),
                    ],
                  );
                },
              );
            },
          ),
        ),
      ),
    );
  }
}
