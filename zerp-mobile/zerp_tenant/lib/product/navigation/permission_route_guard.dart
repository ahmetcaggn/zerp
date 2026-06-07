import 'package:auto_route/auto_route.dart';
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/permission/cubit_permission.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/navigation/permission_route_map.dart';

@singleton
class PermissionRouteGuard extends AutoRouteGuard
    with LoggerMixin<PermissionRouteGuard> {
  PermissionRouteGuard();

  @override
  void onNavigation(NavigationResolver resolver, StackRouter router) {
    final routeName = resolver.route.name;
    final required = kRoutePermissions[routeName];

    // Route has no declared permission requirement → allow.
    if (required == null) {
      resolver.next();
      return;
    }

    final cubitPermission = GetIt.I<CubitPermission>();
    final state = cubitPermission.state;

    // Permissions not yet loaded → allow (PermissionScopeProvider handles the
    // loading/error UX; the guard should not double-block during startup).
    if (state is! StatePermissionLoaded) {
      log.warning(
        'PermissionRouteGuard: permission state is not loaded '
        'when navigating to $routeName — allowing navigation',
      );
      resolver.next();
      return;
    }

    // User has at least one of the required actions → allow.
    if (required.any(state.hasAction)) {
      log.fine(
        'PermissionRouteGuard: access GRANTED to $routeName',
      );
      resolver.next();
      return;
    }

    // Access denied → navigate to the dedicated access-denied page.
    log.info(
      'PermissionRouteGuard: access DENIED to $routeName — '
      'required: $required',
    );

    resolver.redirectUntil(
      RouteAccessDenied(requiredActions: required),
    );
  }
}
