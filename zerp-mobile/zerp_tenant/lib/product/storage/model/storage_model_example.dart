import 'package:zerp_tenant/product/storage/core/storage_base_model.dart';

class StorageModelExample extends StorageBaseModel {
  StorageModelExample({required this.name});

  final String name;

  @override
  Map<String, dynamic> toJson() => {'name': name};
}
