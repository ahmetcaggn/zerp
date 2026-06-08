import 'dart:async';

import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/state_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/permission/cubit_permission.dart';
import 'package:zerp_tenant/product/navigation/app_route.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/service/auth/auth_service.dart';
import 'package:zerp_tenant/product/service/auth/auth_storage_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@lazySingleton
class CubitAuth extends BaseCubit<StateAuth> with LoggerMixin<CubitAuth> {
  CubitAuth(
    this._appRoute,
    this._authService,
    this._authStorageService,
  ) : super(const StateAuthInitial());

  final AppRoute _appRoute;
  final AuthService _authService;
  final AuthStorageService _authStorageService;

  Future<void>? _ongoingCheck;

  @override
  void emit(StateAuth state) {
    super.emit(state);
    if (state is StateAuthAuthenticated) {
      log.info('emit: User authenticated: ${state.username}');
      unawaited(getIt<CubitOrganizationScope>().loadTenantForced());
      unawaited(getIt<CubitPermission>().loadPermissionsForced());
    }
  }

  Future<void> checkAuthLocal() async {
    try {
      final claims = await _authStorageService.authClaimsIfValid;
      if (claims != null) {
        emit(StateAuthAuthenticated(
          username: claims.preferredUsername,
          email: claims.email,
        ));
      }
    } on Object catch (e, s) {
      log.shout('Error while checking local auth', e, s);
    }
  }

  Future<void> checkAuthRemote() async {
    if (_ongoingCheck != null) {
      await _ongoingCheck;
      return;
    }

    final completer = Completer<void>();
    _ongoingCheck = completer.future;

    try {
      final sessionStatus = await _authService
          .checkSessionOnlineStatus()
          .timeout(const Duration(seconds: 20));
      if (sessionStatus == AuthSessionOnlineStatus.invalid) {
        emit(const StateAuthUnauthenticated());
        await _navigateToLoginIfNeeded();
        return;
      }

      final claims = await _authStorageService.authClaimsIfValid.timeout(
        const Duration(seconds: 5),
      );
      if (claims != null) {
        emit(StateAuthAuthenticated(
          username: claims.preferredUsername,
          email: claims.email,
        ));
      } else {
        emit(const StateAuthUnauthenticated());
        await _navigateToLoginIfNeeded();
      }
    } on Object catch (e, s) {
      log.shout('Error while checking auth', e, s);
      emit(StateAuthError(message: t.auth.errors.checkFailed));
      await _navigateToLoginIfNeeded();
    } finally {
      log.fine('Finished checkAuthRemote, clearing ongoing check');
      _ongoingCheck = null;
      completer.complete();
    }
  }

  Future<void> redirectLogin() async {
    emit(const StateAuthLoading());
    try {
      final claims = await _authService.login();
      if (claims != null) {
        log.info('Login successful for user ${claims.preferredUsername}');
        emit(StateAuthAuthenticated(
          username: claims.preferredUsername,
          email: claims.email,
        ));
      } else {
        log.warning('Login failed: No claims returned');
        emit(
          StateAuthError(message: t.auth.errors.loginNoClaims),
        );
      }
    } on Object catch (e, s) {
      log.shout('Error while redirecting to login', e, s);
      emit(
        StateAuthError(
          message: t.auth.errors.loginFailed,
        ),
      );
    }
  }

  Future<void> logout() async {
    emit(const StateAuthLoading());
    try {
      await _authService.logout();
      emit(const StateAuthUnauthenticated());
      await _navigateToLoginIfNeeded();
    } on Object catch (e, s) {
      log.shout('Error while logging out', e, s);
      emit(
        StateAuthError(
          message: t.auth.errors.logoutFailed,
        ),
      );
    } finally {
      getIt<CubitOrganizationScope>().reset();
      getIt<CubitPermission>().reset();
    }
  }

  Future<void> _navigateToLoginIfNeeded() async {
    if (_appRoute.current.name == RouteAuth.name) {
      return;
    }
    final currentPath = _appRoute.current.path;
    await _appRoute.push(RouteAuth(callerRoute: currentPath));
  }

}
