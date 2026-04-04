import 'package:sembast/sembast.dart';
import 'package:zerp_tenant/product/storage/core/storage_base_model.dart';
import 'package:zerp_tenant/product/storage/core/storage_base_operator.dart';
import 'package:zerp_tenant/product/storage/core/storage_model.dart';
import 'package:zerp_tenant/product/storage/core/storage_model_factory.dart';
import 'package:zerp_tenant/product/storage/storage_initializer.dart';

class StorageOperatorExample implements StorageBaseOperator {
  @override
  Future<StorageModel<T>?> get<T extends StorageBaseModel>(
    String key,
    StorageModelFactory<T> factory,
  ) async {
    final rawValue = await StorageInitializer.store
        .record(key)
        .get(StorageInitializer.database);
    if (rawValue == null) {
      return null;
    }

    return StorageModel<T>.fromJson(rawValue, factory);
  }

  @override
  Future<void> put<T extends StorageBaseModel>(
    String key,
    StorageModel<T> value,
  ) async {
    await StorageInitializer.store
        .record(key)
        .put(StorageInitializer.database, value.toJson());
  }
}
