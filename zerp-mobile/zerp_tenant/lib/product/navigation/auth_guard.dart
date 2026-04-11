import 'package:auto_route/auto_route.dart';
import 'package:injectable/injectable.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/service/auth_service.dart';

@injectable
class AuthGuard extends AutoRouteGuard {
  AuthGuard(this._authService);

  final AuthService _authService;

  @override
  Future<void> onNavigation(
    NavigationResolver resolver,
    StackRouter router,
  ) async {
    if (resolver.route.name == RouteAuth.name) {
      resolver.next();
      return;
    }

    if (await _authService.authClaims != null) {
      resolver.next();
      return;
    }
    resolver.redirectUntil(const RouteAuth());
  }
}
