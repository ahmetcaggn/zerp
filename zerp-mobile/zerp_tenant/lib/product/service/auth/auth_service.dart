import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:injectable/injectable.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/model/auth_claims.dart';
import 'package:zerp_tenant/product/service/auth/auth_storage_service.dart';

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

@lazySingleton
final class AuthService with LoggerMixin<AuthService> {
  AuthService(this._appAuth, this._authStorageService);

  // Keycloak configuration
  static const String _issuer = 'https://auth.zeerp.tech/realms/zerp';
  static const String _discoveryUrl =
      'https://auth.zeerp.tech/realms/zerp/.well-known/openid-configuration';
  static const String _clientId = 'zerp-tenant';
  static const String _redirectUrl = 'org.zerp.tenant://callback';
  static const String _postLogoutRedirectUrl = 'org.zerp.tenant://callback';
  static const List<String> _scopes = ['openid', 'profile', 'email'];

  final FlutterAppAuth _appAuth;
  final AuthStorageService _authStorageService;

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
        ),
      );

      await _authStorageService.saveAuthTokensResponse(result);

      if (result.accessToken == null ||
          JwtDecoder.isExpired(result.accessToken!)) {
        await _authStorageService.clearTokens();
        throw Exception(
          'Access token is invalid or expired immediately after login',
        );
      }

      final claims = await _authStorageService.authClaims;
      log.info('Login successful for user: ${claims?.preferredUsername}');
      return claims;
    } on Object catch (e, s) {
      log.severe('Login process failed', e, s);
      rethrow;
    }
  }

  /// Logout from Keycloak and clear stored tokens.
  Future<bool> logout() async {
    log.fine('Starting logout process');

    try {
      final idToken = await _authStorageService.idToken;

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
      await _authStorageService.clearTokens();
    }
  }

  /// Try to refresh the access token silently using the stored refresh token.
  Future<bool> tryRefreshToken() async {
    log.fine('Initiating silent token refresh attempt');
    final refreshStatus = await _tryRefreshTokenInternal();
    log.info('Refresh token attempt completed with status: $refreshStatus');
    return refreshStatus == _RefreshAttemptStatus.refreshed;
  }

  Future<_RefreshAttemptStatus>? _ongoingRefresh;

  Future<_RefreshAttemptStatus> _tryRefreshTokenInternal() async {
    if (_ongoingRefresh != null) {
      log.fine('Token refresh already in progress, awaiting result');
      return _ongoingRefresh!;
    }

    _ongoingRefresh = _doTryRefreshTokenInternal();
    try {
      return await _ongoingRefresh!;
    } finally {
      _ongoingRefresh = null;
    }
  }

  Future<_RefreshAttemptStatus> _doTryRefreshTokenInternal() async {
    log.fine('Attempting to refresh access token silently');

    try {
      final refreshToken = await _authStorageService.refreshToken;
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

      await _authStorageService.saveTokenResponse(result);
      log.info('Silent token refresh successful');
      return _RefreshAttemptStatus.refreshed;
    } on FlutterAppAuthPlatformException catch (e, s) {
      if (_isAuthorizationFailure(e)) {
        await _authStorageService.clearTokens();
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
        return await _authStorageService.isAccessTokenValid
            ? AuthSessionOnlineStatus.valid
            : AuthSessionOnlineStatus.invalid;
      case _RefreshAttemptStatus.invalidSession:
        return AuthSessionOnlineStatus.invalid;
      case _RefreshAttemptStatus.transientFailure:
        return AuthSessionOnlineStatus.unknown;
    }
  }
}
