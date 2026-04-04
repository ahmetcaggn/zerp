import 'package:zerp_tenant/product/storage/core/storage_base_model.dart';
import 'package:zerp_tenant/product/storage/core/storage_metadata_model.dart';
import 'package:zerp_tenant/product/storage/core/storage_model_factory.dart';

class StorageModel<T extends StorageBaseModel> {
  const StorageModel({required this.model, required this.metadata});

  factory StorageModel.fromJson(
    Map<String, dynamic> json,
    StorageModelFactory<T> factory,
  ) {
    return StorageModel(
      model: factory.fromJson(json['model'] as Map<String, dynamic>),
      metadata: StorageMetadataModel.fromJson(
        json['metadata'] as Map<String, dynamic>,
      ),
    );
  }

  final T model;
  final StorageMetadataModel metadata;

  Map<String, dynamic> toJson() {
    return {'model': model.toJson(), 'metadata': metadata.toJson()};
  }
}
