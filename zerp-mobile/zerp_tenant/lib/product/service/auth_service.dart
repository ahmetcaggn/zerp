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

enum AuthSessionOnlineStatus {
  valid,
  invalid,
  unknown,
}

enum _RefreshAttemptStatus {
  refreshed,
  invalidSession,
  transientFailure,
}

@injectable
class AuthService with LoggerMixin<AuthService> {
  AuthService(this._appAuth, this._authTokenOperator, this._authClaimsOperator);

  // Keycloak configuration
  static const String _issuer = 'https://auth.femrek.dev/realms/zerp';
  static const String _discoveryUrl =
      'https://auth.femrek.dev/realms/zerp/.well-known/openid-configuration';
  static const String _clientId = 'zerp-tenant';
  static const String _redirectUrl = 'org.zerp.tenant://callback';
  static const String _postLogoutRedirectUrl = 'org.zerp.tenant://callback';
  static const List<String> _scopes = ['openid', 'profile', 'email'];

  final FlutterAppAuth _appAuth;
  final AuthTokenOperator _authTokenOperator;
  final AuthClaimsOperator _authClaimsOperator;

  /// Login using Keycloak authorization code flow.
  Future<AuthClaims?> login() async {
    log.fine('Starting login process');
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

      if (result.accessToken == null ||
          JwtDecoder.isExpired(result.accessToken!)) {
        await _clearTokens();
        throw Exception(
          'Access token is invalid or expired immediately after login',
        );
      }

      final claims = await _authClaims;
      log.info('Login successful for user: ${claims?.preferredUsername}');
      return claims;
    } on Object catch (e, s) {
      log.severe('Login process failed', e, s);
      rethrow;
    }
  }

  /// Sign up using Keycloak registration flow.
  /// Uses kc_action=register to trigger Keycloak's registration page.
  Future<AuthClaims?> signUp() async {
    log.fine('Starting sign-up process');

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

      if (result.accessToken == null ||
          JwtDecoder.isExpired(result.accessToken!)) {
        await _clearTokens();
        throw Exception(
          'Access token is invalid or expired immediately after sign-up',
        );
      }

      final claims = await _authClaims;
      log.info('Sign-up successful for user: ${claims?.preferredUsername}');
      return claims;
    } on Object catch (e, s) {
      log.severe('Sign-up process failed', e, s);
      rethrow;
    }
  }

  /// Logout from Keycloak and clear stored tokens.
  Future<bool> logout() async {
    log.fine('Starting logout process');

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

      log.info('Remote logout successful');
      return true;
    } on Object catch (e, s) {
      log.warning(
        'Remote logout failed, proceeding to clear local tokens anyway',
        e,
        s,
      );
      return true;
    } finally {
      await _clearTokens();
    }
  }

  /// Try to refresh the access token silently using the stored refresh token.
  Future<bool> tryRefreshToken() async {
    final refreshStatus = await _tryRefreshTokenInternal();
    return refreshStatus == _RefreshAttemptStatus.refreshed;
  }

  Future<_RefreshAttemptStatus> _tryRefreshTokenInternal() async {
    log.fine('Attempting to refresh access token silently');

    try {
      final refreshToken = await _authTokenOperator.refreshToken;
      if (refreshToken == null) {
        log.fine('No refresh token found in storage. Aborting refresh.');
        return _RefreshAttemptStatus.invalidSession;
      }

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
      log.info('Silent token refresh successful');
      return _RefreshAttemptStatus.refreshed;
    } on FlutterAppAuthPlatformException catch (e, s) {
      if (_isAuthorizationFailure(e)) {
        await _clearTokens();
        log.info(
          () =>
              'Silent token refresh detected an invalid remote session '
              '(${e.platformErrorDetails.error}: '
              '${e.platformErrorDetails.errorDescription}). '
              'Local tokens cleared.',
        );
        return _RefreshAttemptStatus.invalidSession;
      }

      log.warning(
        'Silent token refresh failed due to transient/non-auth error. '
        'Keeping local tokens.',
        e,
        s,
      );
      return _RefreshAttemptStatus.transientFailure;
    } on Object catch (e, s) {
      log.warning(
        'Silent token refresh failed due to unknown error. '
        'Keeping local tokens.',
        e,
        s,
      );
      return _RefreshAttemptStatus.transientFailure;
    }
  }

  bool _isAuthorizationFailure(FlutterAppAuthPlatformException exception) {
    final oauthError = exception.platformErrorDetails.error;
    return oauthError == FlutterAppAuthOAuthError.invalidGrant ||
        oauthError == FlutterAppAuthOAuthError.invalidClient ||
        oauthError == FlutterAppAuthOAuthError.unauthorizedClient;
  }

  /// Validate session against the auth server
  ///
  /// Return true if session is valid and access token is still valid after
  /// refresh attempt. Returns false if refresh failed or access token is still
  /// invalid after refresh.
  ///
  /// Removes local tokens if refresh fails or access token is still invalid
  /// after refresh, but does not perform remote logout since session is already
  /// invalid.
  Future<bool> checkSessionOnline() async {
    final status = await checkSessionOnlineStatus();
    return status == AuthSessionOnlineStatus.valid;
  }

  /// Check session status against identity provider.
  ///
  /// - [AuthSessionOnlineStatus.valid]: remote check succeeds
  ///   and token is valid.
  /// - [AuthSessionOnlineStatus.invalid]: identity provider confirms
  ///   session/token is invalid.
  /// - [AuthSessionOnlineStatus.unknown]: connectivity/transient error.
  Future<AuthSessionOnlineStatus> checkSessionOnlineStatus() async {
    log.fine('Checking session status online');

    final refreshStatus = await _tryRefreshTokenInternal();
    switch (refreshStatus) {
      case _RefreshAttemptStatus.refreshed:
        return await isAccessTokenValid
            ? AuthSessionOnlineStatus.valid
            : AuthSessionOnlineStatus.invalid;
      case _RefreshAttemptStatus.invalidSession:
        return AuthSessionOnlineStatus.invalid;
      case _RefreshAttemptStatus.transientFailure:
        return AuthSessionOnlineStatus.unknown;
    }
  }

  Future<bool> get isAccessTokenValid async {
    final accessToken = await _authTokenOperator.accessToken;
    if (accessToken == null) {
      log.fine('No access token found in storage');
      return false;
    } else if (JwtDecoder.isExpired(accessToken)) {
      log.fine(
        () =>
            'Access token is expired. Expiration date: '
            '${JwtDecoder.getExpirationDate(accessToken)}',
      );
      return false;
    } else {
      log.fine('Access token is valid');
      return true;
    }
  }

  Future<AuthClaims?> get authClaimsIfValid async {
    if (await isAccessTokenValid) {
      final claims = await _authClaims;
      log.fine(
        () =>
            'Access token is valid. Retrieving auth claims for user: '
            '${claims?.preferredUsername}',
      );
      return claims;
    }
    log.fine('Access token is invalid or expired. No auth claims available.');
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

    await _authTokenOperator.put(AuthTokenStorageModel(authTokens: tokens));
    await _authClaimsOperator.put(AuthClaimsStorageModel(authClaims: claims));
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
