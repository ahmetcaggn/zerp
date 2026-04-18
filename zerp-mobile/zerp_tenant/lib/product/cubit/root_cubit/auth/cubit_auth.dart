import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/state_auth.dart';
import 'package:zerp_tenant/product/service/auth_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@lazySingleton
class CubitAuth extends BaseCubit<StateAuth> with LoggerMixin<CubitAuth> {
  CubitAuth(this._authService) : super(const StateAuthInitial());

  final AuthService _authService;

  Future<void> checkAuthRemote() async {
    try {
      final sessionStatus = await _authService.checkSessionOnlineStatus();
      if (sessionStatus == AuthSessionOnlineStatus.invalid) {
        emit(const StateAuthUnauthenticated());
        return;
      }

      final claims = await _authService.authClaimsIfValid;
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
    }
  }

  Future<void> redirectLogin() async {
    emit(const StateAuthLoading());
    try {
      final claims = await _authService.login();
      if (claims != null) {
        log.info('Login successful, claims: $claims');
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
