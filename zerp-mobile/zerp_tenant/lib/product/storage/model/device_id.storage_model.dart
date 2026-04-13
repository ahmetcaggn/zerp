import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:zerp_tenant/product/storage/core/model_base/base_storage_model.dart';

part 'device_id.storage_model.freezed.dart';
part 'device_id.storage_model.g.dart';

@freezed
abstract class DeviceIdStorageModel extends StorageBaseModel
    with _$DeviceIdStorageModel {
  const factory DeviceIdStorageModel({
    required String deviceId,
  }) = _DeviceIdStorageModel;

  const DeviceIdStorageModel._();

  factory DeviceIdStorageModel.fromJson(Map<String, dynamic> json) =>
      _$DeviceIdStorageModelFromJson(json);
}

class DeviceIdStorageModelFactory
    implements StorageModelFactory<DeviceIdStorageModel> {
  @override
  DeviceIdStorageModel fromJson(Map<String, dynamic> json) {
    return DeviceIdStorageModel.fromJson(json);
  }
}
