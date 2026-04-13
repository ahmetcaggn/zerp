import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:injectable/injectable.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/model/auth_claims.dart';
import 'package:zerp_tenant/product/model/auth_tokens.dart';
import 'package:zerp_tenant/product/storage/model/auth_claims.storage_model.dart';
import 'package:zerp_tenant/product/storage/model/auth_token.storage_model.dart';
import 'package:zerp_tenant/product/storage/operator/auth_claims.operator.dart';
import 'package:zerp_tenant/product/storage/operator/auth_token.operator.dart';

@injectable
class AuthService with LoggerMixin<AuthService> {
  AuthService(this._appAuth, this._authTokenOperator, this._authClaimsOperator);

  // Keycloak configuration
  static const String _issuer = 'https://auth.femrek.dev/realms/zerp';
  static const String _discoveryUrl =
      'https://auth.femrek.dev/realms/zerp/.well-known/openid-configuration';
  static const String _clientId = 'public';
  static const String _redirectUrl = 'org.zerp.tenant://callback';
  static const String _postLogoutRedirectUrl = 'org.zerp.tenant://callback';
  static const List<String> _scopes = ['openid', 'profile', 'email'];

  final FlutterAppAuth _appAuth;
  final AuthTokenOperator _authTokenOperator;
  final AuthClaimsOperator _authClaimsOperator;

  /// Login using Keycloak authorization code flow.
  Future<AuthClaims?> login() async {
    try {
      final result = await _appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          _clientId,
          _redirectUrl,
          issuer: _issuer,
          discoveryUrl: _discoveryUrl,
          scopes: _scopes,
          promptValues: ['login'],
        ),
      );

      await _saveAuthTokensResponse(result);

      if (!await isAccessTokenValid) {
        await _clearTokens();
        throw Exception('Access token is invalid after login');
      }

      return await _authClaims;
    } on Object catch (e, s) {
      log.severe('Login failed', e, s);
      return null;
    }
  }

  /// Sign up using Keycloak registration flow.
  /// Uses kc_action=register to trigger Keycloak's registration page.
  Future<AuthClaims?> signUp() async {
    try {
      final result = await _appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          _clientId,
          _redirectUrl,
          issuer: _issuer,
          discoveryUrl: _discoveryUrl,
          scopes: _scopes,
          additionalParameters: {'kc_action': 'register'},
        ),
      );

      await _saveAuthTokensResponse(result);

      if (!await isAccessTokenValid) {
        await _clearTokens();
        throw Exception('Access token is invalid after sign up');
      }

      return await _authClaims;
    } on Object catch (e, s) {
      log.severe('Sign up failed', e, s);
      return null;
    }
  }

  /// Logout from Keycloak and clear stored tokens.
  Future<bool> logout() async {
    try {
      final idToken = await _authTokenOperator.idToken;

      if (idToken != null) {
        await _appAuth.endSession(
          EndSessionRequest(
            idTokenHint: idToken,
            postLogoutRedirectUrl: _postLogoutRedirectUrl,
            issuer: _issuer,
            discoveryUrl: _discoveryUrl,
          ),
        );
      }

      return true;
    } on Object catch (e, s) {
      log.warning('Logout failed (still removing tokens)', e, s);
      return true;
    } finally {
      await _clearTokens();
    }
  }

  /// Try to refresh the access token silently using the stored refresh token.
  Future<bool> tryRefreshToken() async {
    try {
      final refreshToken = await _authTokenOperator.refreshToken;
      if (refreshToken == null) return false;

      final result = await _appAuth.token(
        TokenRequest(
          _clientId,
          _redirectUrl,
          issuer: _issuer,
          discoveryUrl: _discoveryUrl,
          refreshToken: refreshToken,
          scopes: _scopes,
        ),
      );

      await _saveTokenResponse(result);
      return true;
    } on Object catch (_) {
      log.shout('Failed to refresh token silently, clearing stored tokens');
      await _clearTokens();
      return false;
    }
  }

  Future<bool> get isAccessTokenValid async {
    final accessToken = await _authTokenOperator.accessToken;
    return accessToken != null && !JwtDecoder.isExpired(accessToken);
  }

  Future<AuthClaims?> get authClaimsIfValid async {
    final accessToken = await _authTokenOperator.accessToken;
    if (accessToken != null && !JwtDecoder.isExpired(accessToken)) {
      return _authClaims;
    }
    return null;
  }

  Future<AuthClaims?> get _authClaims async {
    final authClaimsModel = await _authClaimsOperator.get();
    return authClaimsModel?.authClaims;
  }

  Future<void> _saveAuthTokensResponse(
    AuthorizationTokenResponse response,
  ) async {
    final accessToken = response.accessToken;
    final refreshToken = response.refreshToken;
    final idToken = response.idToken;

    if (accessToken == null || refreshToken == null || idToken == null) {
      throw Exception('Missing tokens in the response');
    }

    await _saveTokens(
      accessToken: accessToken,
      refreshToken: refreshToken,
      idToken: idToken,
    );
  }

  Future<void> _saveTokenResponse(TokenResponse response) async {
    final accessToken = response.accessToken;
    final refreshToken = response.refreshToken;
    final idToken = response.idToken;

    if (accessToken == null || refreshToken == null || idToken == null) {
      throw Exception('Missing tokens in the response');
    }

    await _saveTokens(
      accessToken: accessToken,
      refreshToken: refreshToken,
      idToken: idToken,
    );
  }

  Future<void> _saveTokens({
    required String accessToken,
    required String refreshToken,
    required String idToken,
  }) async {
    final tokens = AuthTokens(
      accessToken: accessToken,
      refreshToken: refreshToken,
      idToken: idToken,
    );
    final claims = _extractAllClaims(tokens);
    await _authTokenOperator.put(
      AuthTokenStorageModel(authTokens: tokens),
    );
    await _authClaimsOperator.put(
      AuthClaimsStorageModel(authClaims: claims),
    );
  }

  Future<void> _clearTokens() async {
    await _authTokenOperator.clear();
    await _authClaimsOperator.clear();
  }

  AuthClaims _extractAllClaims(AuthTokens tokens) {
    final accessToken = tokens.accessToken;
    final refreshToken = tokens.refreshToken;
    final idToken = tokens.idToken;

    final accessClaims = JwtDecoder.decode(accessToken);
    final refreshClaims = JwtDecoder.decode(refreshToken);
    final idClaims = idToken != null ? JwtDecoder.decode(idToken) : null;

    // mandatory claims from access token
    final sub = accessClaims['sub'];
    final preferredUsername = accessClaims['preferred_username'];
    if (sub == null || preferredUsername == null) {
      throw Exception(
        'Missing mandatory claims in access token. '
        'sub: $sub, preferred_username: $preferredUsername',
      );
    }
    if (sub is! String || preferredUsername is! String) {
      throw Exception(
        'Invalid claim types in access token. '
        'Expected sub and preferred_username to be strings. '
        'Got sub: ${sub.runtimeType}, '
        'preferred_username: ${preferredUsername.runtimeType}',
      );
    }

    // optional claims from access token
    final firstName = accessClaims['first_name'];
    final lastName = accessClaims['last_name'];

    return AuthClaims(
      accessTokenClaims: accessClaims,
      refreshTokenClaims: refreshClaims,
      idTokenClaims: idClaims ?? {},
      sub: sub,
      preferredUsername: preferredUsername,
      firstName: firstName?.toString(),
      lastName: lastName?.toString(),
    );
  }
}
