import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:injectable/injectable.dart';
import 'package:zerp_tenant/product/model/auth_tokens.dart';
import 'package:zerp_tenant/product/storage/core/storage_base_operator.dart';
import 'package:zerp_tenant/product/storage/model/auth_token.storage_model.dart';

@injectable
class AuthTokenOperator extends SingleStorageOperator<AuthTokenStorageModel> {
  AuthTokenOperator(this._s);

  final FlutterSecureStorage _s;

  static const String _keyAccessToken = 'auth_token_access_token';
  static const String _keyRefreshToken = 'auth_token_refresh_token';
  static const String _keyIdToken = 'auth_token_id_token';

  @override
  Future<void> clear() async {
    await _s.delete(key: _keyAccessToken);
    await _s.delete(key: _keyRefreshToken);
    await _s.delete(key: _keyIdToken);
  }

  @override
  Future<AuthTokenStorageModel?> get() async {
    final at = await accessToken;
    final rt = await refreshToken;
    final it = await idToken;

    if (at == null || rt == null) {
      return null;
    }

    return AuthTokenStorageModel(
      authTokens: AuthTokens(
        accessToken: at,
        refreshToken: rt,
        idToken: it,
      ),
    );
  }

  @override
  Future<AuthTokenStorageModel> put(AuthTokenStorageModel value) async {
    await _s.write(key: _keyAccessToken, value: value.authTokens.accessToken);
    await _s.write(key: _keyRefreshToken, value: value.authTokens.refreshToken);
    await _s.write(key: _keyIdToken, value: value.authTokens.idToken);

    return value;
  }

  Future<String?> get accessToken async => _s.read(key: _keyAccessToken);

  Future<String?> get refreshToken async => _s.read(key: _keyRefreshToken);

  Future<String?> get idToken async => _s.read(key: _keyIdToken);
}
