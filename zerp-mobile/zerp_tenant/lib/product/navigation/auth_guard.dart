import 'package:auto_route/auto_route.dart';
import 'package:injectable/injectable.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/service/auth/auth_service.dart';
import 'package:zerp_tenant/product/service/auth/auth_storage_service.dart';

@singleton
class AuthGuard extends AutoRouteGuard {
  AuthGuard(this._authStorageService, this._authService);

  final AuthStorageService _authStorageService;
  final AuthService _authService;

  @override
  Future<void> onNavigation(
    NavigationResolver resolver,
    StackRouter router,
  ) async {
    // Routes accessible without authentication
    const unauthenticatedRoutes = {
      RouteAuth.name,
      RouteSettings.name,
      RouteSettingsApiBaseUrl.name,
    };
    if (unauthenticatedRoutes.contains(resolver.route.name)) {
      resolver.next();
      return;
    }

    if (await _authStorageService.authClaimsIfValid != null) {
      resolver.next();
      return;
    }

    final status = await _authService.checkSessionOnlineStatus();
    if (status == AuthSessionOnlineStatus.valid) {
      resolver.next();
      return;
    }

    resolver.redirectUntil(RouteAuth(callerRoute: resolver.route.path));
  }
}
