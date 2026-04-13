import 'package:zerp_tenant/product/storage/core/model_base/base_storage_model.dart';

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

final class StorageMetadataModel {
  const StorageMetadataModel({
    required this.key,
    required this.updatedAt,
    required this.createdAt,
  });

  factory StorageMetadataModel.fromJson(Map<String, dynamic> json) {
    return StorageMetadataModel(
      key: json['key'] as String,
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  final String key;
  final DateTime updatedAt;
  final DateTime createdAt;

  Map<String, dynamic> toJson() {
    return {
      'key': key,
      'updatedAt': updatedAt.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
