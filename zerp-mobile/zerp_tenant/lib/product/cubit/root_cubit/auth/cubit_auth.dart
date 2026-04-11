import 'package:injectable/injectable.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/state_auth.dart';
import 'package:zerp_tenant/product/service/auth_service.dart';

@injectable
class CubitAuth extends BaseCubit<StateAuth> {
  CubitAuth(this._authService) : super(const StateAuthInitial());

  final AuthService _authService;

  Future<void> checkAuth() async {
    final claims = await _authService.authClaimsIfValid;
    if (claims != null) {
      emit(StateAuthAuthenticated(username: claims.preferredUsername));
    } else {
      emit(const StateAuthUnauthenticated());
    }
  }

  Future<void> redirectLogin() async {
    final claims = await _authService.login();
    if (claims != null) {
      emit(StateAuthAuthenticated(username: claims.preferredUsername));
    } else {
      emit(const StateAuthError(message: 'Login failed'));
    }
  }

  Future<void> redirectSignUp() async {
    await _authService.signUp();
  }
}
