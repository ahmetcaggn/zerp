import 'package:injectable/injectable.dart';
import 'package:sembast/sembast.dart';
import 'package:zerp_tenant/product/storage/core/storage_base_operator.dart';
import 'package:zerp_tenant/product/storage/model/device_id.storage_model.dart';
import 'package:zerp_tenant/product/storage/storage_initializer.dart';

@injectable
class DeviceIdOperator extends SingleStorageOperator<DeviceIdStorageModel> {
  static const String _key = 'device_id';

  @override
  Future<void> clear() async {
    await StorageInitializer.store
        .record(_key)
        .delete(StorageInitializer.database);
  }

  @override
  Future<DeviceIdStorageModel?> get() async {
    final rawValue = await StorageInitializer.store
        .record(_key)
        .get(StorageInitializer.database);

    if (rawValue == null) {
      return null;
    }

    return DeviceIdStorageModel.fromJson(rawValue);
  }

  @override
  Future<DeviceIdStorageModel> put(DeviceIdStorageModel value) async {
    final result = await StorageInitializer.store
        .record(_key)
        .put(StorageInitializer.database, value.toJson());

    return DeviceIdStorageModel.fromJson(result);
  }
}
