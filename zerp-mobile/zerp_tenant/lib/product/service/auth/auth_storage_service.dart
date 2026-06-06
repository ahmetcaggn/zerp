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

@lazySingleton
final class AuthStorageService with LoggerMixin<AuthStorageService> {
  AuthStorageService(
    this._authTokenOperator,
    this._authClaimsOperator,
  );

  final AuthTokenOperator _authTokenOperator;
  final AuthClaimsOperator _authClaimsOperator;

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
      final claims = await authClaims;
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

  Future<AuthClaims?> get authClaims async {
    final authClaimsModel = await _authClaimsOperator.get();
    return authClaimsModel?.authClaims;
  }

  Future<String?> get accessToken async {
    final authTokenModel = await _authTokenOperator.get();
    return authTokenModel?.authTokens.accessToken;
  }

  Future<String?> get refreshToken async {
    final authTokenModel = await _authTokenOperator.get();
    return authTokenModel?.authTokens.refreshToken;
  }

  Future<String?> get idToken async {
    final authTokenModel = await _authTokenOperator.get();
    return authTokenModel?.authTokens.idToken;
  }

  Future<void> saveAuthTokensResponse(
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

  Future<void> saveTokenResponse(TokenResponse response) async {
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

  Future<void> clearTokens() async {
    await _authTokenOperator.clear();
    await _authClaimsOperator.clear();
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
    final tenantId = accessClaims['tenant_id'];
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
    if (tenantId == null || tenantId is! String) {
      throw Exception(
        'Missing or invalid tenant_id claim in access token. '
        'Expected tenant_id to be a string. Got tenant_id: $tenantId, '
        'type: ${tenantId.runtimeType}',
      );
    }

    // optional claims from access token
    final firstName = accessClaims['first_name'];
    final lastName = accessClaims['last_name'];
    final email = accessClaims['email'] ?? idClaims?['email'];

    return AuthClaims(
      accessTokenClaims: accessClaims,
      refreshTokenClaims: refreshClaims,
      idTokenClaims: idClaims ?? {},
      sub: sub,
      preferredUsername: preferredUsername,
      tenantId: tenantId,
      firstName: firstName?.toString(),
      lastName: lastName?.toString(),
      email: email?.toString(),
    );
  }
}
