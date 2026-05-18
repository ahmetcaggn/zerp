import 'package:injectable/injectable.dart';
import 'package:sembast/sembast.dart';
import 'package:zerp_tenant/product/storage/core/storage_base_operator.dart';
import 'package:zerp_tenant/product/storage/model/settings.storage_model.dart';
import 'package:zerp_tenant/product/storage/storage_initializer.dart';

@lazySingleton
class SettingsOperator extends SingleStorageOperator<SettingsStorageModel> {
  static const String _key = 'settings';

  @override
  Future<void> clear() async {
    await StorageInitializer.store
        .record(_key)
        .delete(StorageInitializer.database);
  }

  @override
  Future<SettingsStorageModel?> get() async {
    final rawValue = await StorageInitializer.store
        .record(_key)
        .get(StorageInitializer.database);

    if (rawValue == null) {
      return null;
    }

    return SettingsStorageModel.fromJson(rawValue);
  }

  @override
  Future<SettingsStorageModel> put(SettingsStorageModel value) async {
    final result = await StorageInitializer.store
        .record(_key)
        .put(StorageInitializer.database, value.toJson());

    return SettingsStorageModel.fromJson(result);
  }
}
