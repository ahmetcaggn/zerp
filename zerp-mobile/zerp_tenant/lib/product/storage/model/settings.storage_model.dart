import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:zerp_tenant/product/storage/core/model_base/base_storage_model.dart';

part 'settings.storage_model.freezed.dart';
part 'settings.storage_model.g.dart';

@freezed
abstract class SettingsStorageModel extends StorageBaseModel
    with _$SettingsStorageModel {
  const factory SettingsStorageModel({
    String? apiHost,
  }) = _SettingsStorageModel;

  const SettingsStorageModel._();

  factory SettingsStorageModel.fromJson(Map<String, dynamic> json) =>
      _$SettingsStorageModelFromJson(json);
}
