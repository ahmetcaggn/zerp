class StorageMetadataModel {
  const StorageMetadataModel({required this.key, required this.updatedAt});

  factory StorageMetadataModel.fromJson(Map<String, dynamic> json) {
    return StorageMetadataModel(
      key: json['key'] as String,
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  final String key;
  final DateTime updatedAt;

  Map<String, dynamic> toJson() {
    return {'key': key, 'updatedAt': updatedAt.toIso8601String()};
  }
}
