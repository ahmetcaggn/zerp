import 'package:injectable/injectable.dart';
import 'package:sembast/sembast.dart';
import 'package:zerp_tenant/product/storage/core/storage_base_operator.dart';
import 'package:zerp_tenant/product/storage/model/auth_claims.storage_model.dart';
import 'package:zerp_tenant/product/storage/storage_initializer.dart';

@injectable
class AuthClaimsOperator extends SingleStorageOperator<AuthClaimsStorageModel> {
  static const String _keyAuthClaims = 'auth_claims';

  @override
  Future<void> clear() async {
    await StorageInitializer.store
        .record(_keyAuthClaims)
        .delete(StorageInitializer.database);
  }

  @override
  Future<AuthClaimsStorageModel?> get() async {
    final rawValue = await StorageInitializer.store
        .record(_keyAuthClaims)
        .get(StorageInitializer.database);

    if (rawValue == null) {
      return null;
    }

    return AuthClaimsStorageModel.fromJson(rawValue);
  }

  @override
  Future<AuthClaimsStorageModel> put(AuthClaimsStorageModel value) async {
    final saved = await StorageInitializer.store
        .record(_keyAuthClaims)
        .put(StorageInitializer.database, value.toJson());

    return AuthClaimsStorageModel.fromJson(saved);
  }
}
