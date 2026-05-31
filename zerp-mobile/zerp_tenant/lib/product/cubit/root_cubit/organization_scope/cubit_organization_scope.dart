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
    if (state is! StateOrganizationScopeTenant) {
      if (_loadTenantFuture != null) {
        try {
          await _loadTenantFuture;
        } on Object catch (_) {}
      }
      if (state is! StateOrganizationScopeTenant) {
        await loadTenant();
      }
    }
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
      return;
    }

    late final ShopDTO shop;
    try {
      shop = await _shopService.getShop(id: shopId);
    } on Object catch (e, s) {
      log.severe('Failed to fetch shop info for organization scope', e, s);
      emit(
        StateOrganizationScopeError(
          previousState: state,
          message: 'Failed to load shop information',
        ),
      );
      return;
    }

    emit(StateOrganizationScopeShop(tenant: currentState.tenant, shop: shop));
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
      return;
    }

    emit(StateOrganizationScopeShop(tenant: currentState.tenant, shop: shop));
  }

  void dismissError() {
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
  }

  Future<void> retry() async {
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
  }
}

sealed class StateOrganizationScope {
  const StateOrganizationScope();
}

final class StateOrganizationScopeInitial extends StateOrganizationScope {
  const StateOrganizationScopeInitial();
}

final class StateOrganizationScopeLoading extends StateOrganizationScope {
  const StateOrganizationScopeLoading();
}

final class StateOrganizationScopeError extends StateOrganizationScope {
  const StateOrganizationScopeError({
    required this.previousState,
    required this.message,
  });

  final StateOrganizationScope previousState;
  final String message;
}

final class StateOrganizationScopeTenant extends StateOrganizationScope {
  const StateOrganizationScopeTenant({
    required this.tenant,
  });

  final TenantResponseDTO tenant;
}

final class StateOrganizationScopeShop extends StateOrganizationScopeTenant {
  const StateOrganizationScopeShop({
    required super.tenant,
    required this.shop,
  });

  final ShopDTO shop;
}
