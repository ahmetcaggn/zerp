// ignore_for_file: one_member_abstracts base class

import 'package:zerp_tenant/product/storage/core/storage_base_model.dart';

abstract class StorageModelFactory<T extends StorageBaseModel> {
  T fromJson(Map<String, dynamic> json);
}
