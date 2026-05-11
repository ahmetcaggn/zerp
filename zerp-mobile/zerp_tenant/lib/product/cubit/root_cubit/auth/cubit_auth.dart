import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/state_auth.dart';
import 'package:zerp_tenant/product/service/auth/auth_service.dart';
import 'package:zerp_tenant/product/service/auth/auth_storage_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@lazySingleton
class CubitAuth extends BaseCubit<StateAuth> with LoggerMixin<CubitAuth> {
  CubitAuth(
    this._authService,
    this._authStorageService,
  ) : super(const StateAuthInitial());

  final AuthService _authService;
  final AuthStorageService _authStorageService;
  bool _isCheckingAuth = false;

  Future<void> checkAuthRemote() async {
    if (_isCheckingAuth) return;
    _isCheckingAuth = true;
    try {
      final sessionStatus = await _authService.checkSessionOnlineStatus();
      if (sessionStatus == AuthSessionOnlineStatus.invalid) {
        emit(const StateAuthUnauthenticated());
        return;
      }

      final claims = await _authStorageService.authClaimsIfValid;
      if (claims != null) {
        emit(StateAuthAuthenticated(username: claims.preferredUsername));
      } else {
        emit(const StateAuthUnauthenticated());
      }
    } on Object catch (e, s) {
      log.shout('Error while checking auth', e, s);
      emit(
        StateAuthError(
          message: t.auth.errors.checkFailed,
        ),
      );
    } finally {
      _isCheckingAuth = false;
    }
  }

  Future<void> redirectLogin() async {
    emit(const StateAuthLoading());
    try {
      final claims = await _authService.login();
      if (claims != null) {
        log.info('Login successful for user ${claims.preferredUsername}');
        emit(StateAuthAuthenticated(username: claims.preferredUsername));
      } else {
        log.warning('Login failed: No claims returned');
        emit(
          StateAuthError(
            message: t.auth.errors.loginNoClaims,
          ),
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

  Future<void> redirectSignUp() async {
    emit(const StateAuthLoading());

    try {
      final claims = await _authService.signUp();
      if (claims != null) {
        emit(StateAuthAuthenticated(username: claims.preferredUsername));
        return;
      }

      await checkAuthRemote();
      if (state is! StateAuthAuthenticated) {
        emit(
          StateAuthError(
            message: t.auth.errors.signUpFailed,
          ),
        );
      }
    } on Object catch (e, s) {
      log.shout('Error while redirecting to sign up', e, s);
      emit(
        StateAuthError(
          message: t.auth.errors.signUpFailed,
        ),
      );
    }
  }
}
