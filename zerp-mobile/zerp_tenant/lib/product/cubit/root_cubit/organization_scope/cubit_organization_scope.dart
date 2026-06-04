import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/service/auth/auth_storage_service.dart';
import 'package:zerp_tenant/product/service/shop/shop_service.dart';
import 'package:zerp_tenant/product/service/tenant/tenant_service.dart';
import 'package:zerp_tenant/product/util/constants.dart';

@lazySingleton
final class CubitOrganizationScope extends BaseCubit<StateOrganizationScope>
    with LoggerMixin<CubitOrganizationScope> {
  CubitOrganizationScope(
    this._authStorageService,
    this._tenantService,
    this._shopService,
    this._cubitAuth,
  ) : super(const StateOrganizationScopeInitial());

  final AuthStorageService _authStorageService;
  final TenantService _tenantService;
  final ShopService _shopService;
  final CubitAuth _cubitAuth;

  Future<void> loadTenantIfNeeded() async {
    log.fine(
      'Checking if tenant information needs to be loaded '
      'for organization scope',
    );
    if (state is! StateOrganizationScopeTenant) {
      if (_loadTenantFuture != null) {
        log.fine(
          'Tenant information is currently being loaded, '
          'awaiting existing load operation',
        );
        try {
          await _loadTenantFuture;
        } on Object catch (_) {}
      }

      if (state is! StateOrganizationScopeTenant) {
        log.info(
          'Tenant information is not loaded for organization scope, '
          'starting to load tenant information',
        );
        await loadTenant();
      } else {
        log.fine(
          'Tenant information is already loaded for organization scope, '
          'no need to load tenant information',
        );
      }
    }

    log.fine(
      'Current state of organization scope after loadTenantIfNeeded: $state',
    );
  }

  Future<void>? _loadTenantFuture;

  Future<void> loadTenant() async {
    log.fine('Starting to load tenant information for organization scope');
    if (_loadTenantFuture != null) {
      log.fine(
        'Tenant information is already being loaded, '
        'awaiting existing load operation',
      );
      return _loadTenantFuture!;
    }
    log.fine('No existing tenant load operation, starting a new one');
    _loadTenantFuture = _loadTenant();
    final result = await _loadTenantFuture;
    _loadTenantFuture = null;
    return result;
  }

  Future<void> _loadTenant() async {
    emit(const StateOrganizationScopeLoading());

    TenantResponseDTO? tenant;
    try {
      final claims = await _authStorageService.authClaims;
      final tenantId = claims?.tenantId;

      if (tenantId == null) {
        log.warning('No valid tenant ID found in auth claims');
        emit(
          StateOrganizationScopeError(
            previousState: state,
            message: 'No valid tenant information available',
          ),
        );
        return;
      } else if (tenantId == kTenantRootId) {
        log.warning(
          'Tenant ID in auth claims is root tenant ID, '
          'which is not valid for organization scope',
        );
        emit(
          StateOrganizationScopeError(
            previousState: state,
            message: 'System users are not able to use application',
          ),
        );
        return;
      }

      if (!await _authStorageService.isAccessTokenValid) {
        await _cubitAuth.checkAuthRemote();
      }
      tenant = await _tenantService.getTenant(id: tenantId);
      emit(StateOrganizationScopeTenant(tenant: tenant));
    } on Object catch (e, s) {
      log.severe('Failed to fetch tenant info for dashboard', e, s);
      emit(
        StateOrganizationScopeError(
          previousState: state,
          message: 'Failed to load tenant information',
        ),
      );
    } finally {
      _loadTenantFuture = null;
      if (state is StateOrganizationScopeLoading) {
        log.shout(
          'Tenant loading completed but state is still loading, '
          'this should not happen, resetting to initial state',
        );
        emit(const StateOrganizationScopeInitial());
      }
    }
  }

  Future<void> loadShopByShopId(String shopId) async {
    final currentState = state;
    if (currentState is! StateOrganizationScopeTenant) {
      log.severe(
        'Cannot load shop into organization scope '
        'because tenant information is not loaded',
      );
      emit(
        StateOrganizationScopeError(
          previousState: state,
          message: 'Cannot load shop information without tenant information',
        ),
      );
    } else {
      try {
        final shop = await _shopService.getShop(id: shopId);
        emit(
          StateOrganizationScopeShop(tenant: currentState.tenant, shop: shop),
        );
      } on Object catch (e, s) {
        log.severe('Failed to fetch shop info for organization scope', e, s);
        emit(
          StateOrganizationScopeError(
            previousState: state,
            message: 'Failed to load shop information',
          ),
        );
      }
    }

    log.fine('Current state after loading shop by shop ID: $state');
  }

  void loadShop(ShopDTO shop) {
    final currentState = state;
    if (currentState is! StateOrganizationScopeTenant) {
      log.severe(
        'Cannot load shop into organization scope '
        'because tenant information is not loaded',
      );
      emit(
        StateOrganizationScopeError(
          previousState: state,
          message: 'Cannot load shop information without tenant information',
        ),
      );
    } else {
      emit(StateOrganizationScopeShop(tenant: currentState.tenant, shop: shop));
    }

    log.fine('Current state after loading shop: $state');
  }

  void dismissError() {
    log.fine('Dismissing error state in organization scope');
    final currentState = state;
    if (currentState is StateOrganizationScopeError) {
      final previousState = currentState.previousState;
      if (previousState is StateOrganizationScopeTenant) {
        emit(previousState);
      } else {
        log.shout(
          'Previous state before error is not tenant state, '
          'which is unexpected, previousState: $previousState',
        );
      }
    }

    log.fine('Current state after dismissing error: $state');
  }

  Future<void> retry() async {
    log.fine('Retrying loading organization scope');
    final currentState = state;
    if (currentState is StateOrganizationScopeError) {
      await loadTenant();
    } else {
      log.shout(
        'Cannot retry loading organization scope '
        'because current state is not error, '
        'currentState: $currentState',
      );
    }

    log.fine('Current state after dismissing error: $state');
  }

  void reset() {
    log.fine('Resetting organization scope to initial state');
    emit(const StateOrganizationScopeInitial());
    log.fine('Current state after reset: $state');
  }
}

sealed class StateOrganizationScope {
  const StateOrganizationScope();
}

final class StateOrganizationScopeInitial extends StateOrganizationScope {
  const StateOrganizationScopeInitial();

  @override
  String toString() {
    return 'StateOrganizationScopeInitial()';
  }
}

final class StateOrganizationScopeLoading extends StateOrganizationScope {
  const StateOrganizationScopeLoading();

  @override
  String toString() {
    return 'StateOrganizationScopeLoading()';
  }
}

final class StateOrganizationScopeError extends StateOrganizationScope {
  const StateOrganizationScopeError({
    required this.previousState,
    required this.message,
  });

  final StateOrganizationScope previousState;
  final String message;

  @override
  String toString() {
    return 'StateOrganizationScopeError(previousState: $previousState, '
        'message: $message)';
  }
}

final class StateOrganizationScopeTenant extends StateOrganizationScope {
  const StateOrganizationScopeTenant({
    required this.tenant,
  });

  final TenantResponseDTO tenant;

  @override
  String toString() {
    return 'StateOrganizationScopeTenant(tenant: ${tenant.id})';
  }
}

final class StateOrganizationScopeShop extends StateOrganizationScopeTenant {
  const StateOrganizationScopeShop({
    required super.tenant,
    required this.shop,
  });

  final ShopDTO shop;

  @override
  String toString() {
    return 'StateOrganizationScopeShop(tenant: ${tenant.id}, shop: ${shop.id})';
  }
}
