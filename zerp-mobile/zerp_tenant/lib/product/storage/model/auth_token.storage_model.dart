import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:zerp_tenant/product/model/auth_tokens.dart';
import 'package:zerp_tenant/product/storage/core/model_base/base_storage_model.dart';

part 'auth_token.storage_model.freezed.dart';
part 'auth_token.storage_model.g.dart';

@freezed
abstract class AuthTokenStorageModel extends StorageBaseModel
    with _$AuthTokenStorageModel {
  const factory AuthTokenStorageModel({
    @JsonKey(fromJson: _authTokensFromJson, toJson: _authTokensToJson)
    required AuthTokens authTokens,
  }) = _AuthTokenStorageModel;

  const AuthTokenStorageModel._();

  factory AuthTokenStorageModel.fromJson(Map<String, dynamic> json) =>
      _$AuthTokenStorageModelFromJson(json);
}

AuthTokens _authTokensFromJson(Map<String, dynamic> json) =>
    AuthTokens.fromJson(json);

Map<String, dynamic> _authTokensToJson(AuthTokens value) => value.toJson();

class AuthTokenStorageModelFactory
    implements StorageModelFactory<AuthTokenStorageModel> {
  @override
  AuthTokenStorageModel fromJson(Map<String, dynamic> json) {
    return AuthTokenStorageModel.fromJson(json);
  }
}
