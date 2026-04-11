import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:zerp_tenant/product/model/auth_claims.dart';
import 'package:zerp_tenant/product/storage/core/model_base/base_storage_model.dart';

part 'auth_claims.storage_model.freezed.dart';
part 'auth_claims.storage_model.g.dart';

@freezed
abstract class AuthClaimsStorageModel extends StorageBaseModel
    with _$AuthClaimsStorageModel {
  const factory AuthClaimsStorageModel({required AuthClaims authClaims}) =
      _AuthClaimsStorageModel;

  const AuthClaimsStorageModel._();

  factory AuthClaimsStorageModel.fromJson(Map<String, dynamic> json) =>
      _$AuthClaimsStorageModelFromJson(json);
}

class AuthClaimsStorageModelFactory
    implements StorageModelFactory<AuthClaimsStorageModel> {
  @override
  AuthClaimsStorageModel fromJson(Map<String, dynamic> json) {
    return AuthClaimsStorageModel.fromJson(json);
  }
}
