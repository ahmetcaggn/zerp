import 'package:zerp_tenant/product/storage/core/model_base/base_storage_model.dart';
import 'package:zerp_tenant/product/storage/core/model_base/storage_model.dart';

sealed class StorageBaseOperator {}

abstract class SingleStorageOperator<T extends StorageBaseModel>
    implements StorageBaseOperator {
  Future<T> put(T value);

  Future<T?> get();

  Future<void> clear();
}

abstract class StorageOperator<T extends StorageBaseModel>
    implements StorageBaseOperator {
  Future<T> put(StorageModel<T> value);

  Future<StorageModel<T>?> get(String key);

  Future<void> delete(String key);

  Future<void> clear();
}

abstract class FullStorageOperator<T extends StorageBaseModel>
    implements StorageOperator<T> {
  Future<Map<String, T>> putAll(
    Map<String, StorageModel<T>> entries,
  );

  Future<Map<String, StorageModel<T>>> getAll(
    List<String> keys,
    StorageModelFactory<T> factory,
  );

  Future<void> deleteAll(List<String> keys);
}
