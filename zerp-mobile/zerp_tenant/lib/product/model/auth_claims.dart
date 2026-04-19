import 'package:freezed_annotation/freezed_annotation.dart';

part 'auth_claims.freezed.dart';
part 'auth_claims.g.dart';

@Freezed(toStringOverride: true)
abstract class AuthClaims with _$AuthClaims {
  const factory AuthClaims({
    required Map<String, dynamic> accessTokenClaims,
    required Map<String, dynamic> refreshTokenClaims,
    required Map<String, dynamic> idTokenClaims,
    required String sub,
    required String preferredUsername,
    String? firstName,
    String? lastName,
  }) = _AuthClaims;

  factory AuthClaims.fromJson(Map<String, dynamic> json) =>
      _$AuthClaimsFromJson(json);

  @override
  String toString() {
    return 'AuthClaims(sub: $sub, preferredUsername: $preferredUsername, '
        'firstName: $firstName, lastName: $lastName, others: '
        '{accessTokenClaims: ${accessTokenClaims.keys.toList()}, '
        'refreshTokenClaims: ${refreshTokenClaims.keys.toList()}, '
        'idTokenClaims: ${idTokenClaims.keys.toList()}})';
  }
}
