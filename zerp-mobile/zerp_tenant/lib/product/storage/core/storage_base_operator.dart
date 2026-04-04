import 'package:zerp_tenant/product/storage/core/storage_base_model.dart';
import 'package:zerp_tenant/product/storage/core/storage_model.dart';
import 'package:zerp_tenant/product/storage/core/storage_model_factory.dart';

abstract interface class StorageBaseOperator {
  Future<void> put<T extends StorageBaseModel>(
    String key,
    StorageModel<T> value,
  );

  Future<StorageModel<T>?> get<T extends StorageBaseModel>(
    String key,
    StorageModelFactory<T> factory,
  );
}
