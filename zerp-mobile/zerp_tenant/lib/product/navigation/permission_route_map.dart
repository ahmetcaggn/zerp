import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';

/// Declares the required [PermittableAction]s for each protected route.
///
/// A user is granted access to a route if their `flatActions` set contains
/// **ANY** of the actions listed for that route.
///
/// Routes absent from this map have no permission requirement (always allowed).
const Map<String, Set<PermittableAction>> kRoutePermissions = {
  // ── Employee ──────────────────────────────────────────────────────────────
  RouteEmployee.name: {PermittableAction.READ_EMPLOYEE},
  RouteCreateEmployee.name: {PermittableAction.CREATE_EMPLOYEE},
  RouteSingleEmployee.name: {PermittableAction.READ_EMPLOYEE},
  RouteEditEmployee.name: {PermittableAction.UPDATE_EMPLOYEE},
  RoutePermissions.name: {PermittableAction.READ_PERMISSION},
  RouteCreatePermission.name: {PermittableAction.ADMIN},

  // ── Sale / Shop ───────────────────────────────────────────────────────────
  RouteStore.name: {
    PermittableAction.READ_SHOP,
    PermittableAction.ADMIN_SHOP,
  },
  RouteTables.name: {
    PermittableAction.READ_SHOP_TABLE,
    PermittableAction.ADMIN_SHOP,
    PermittableAction.ADMIN_SHOP_TABLE,
  },
  RouteCashTables.name: {
    PermittableAction.READ_SHOP_TABLE,
    PermittableAction.ADMIN_SHOP,
    PermittableAction.ADMIN_SHOP_TABLE,
  },
  RouteTableOrder.name: {PermittableAction.READ_TABLE_ORDER},
  RouteCashOrder.name: {PermittableAction.READ_TABLE_ORDER},
  RouteCashPayment.name: {PermittableAction.READ_TABLE_ORDER},

  // ── Menu ──────────────────────────────────────────────────────────────────
  RouteMenu.name: {
    PermittableAction.READ_MENU,
    PermittableAction.ADMIN_MENU,
  },

  // ── Stock ─────────────────────────────────────────────────────────────────
  RouteStock.name: {
    PermittableAction.READ_STOCK_RESOURCE,
    PermittableAction.ADMIN_STOCK_RESOURCE,
  },
};
