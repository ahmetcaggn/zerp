// ignore_for_file: one_member_abstracts base class
import 'package:meta/meta.dart';

abstract class StorageBaseModel {
  const StorageBaseModel();

  @mustCallSuper
  Map<String, dynamic> toJson();
}

abstract class StorageModelFactory<T extends StorageBaseModel> {
  T fromJson(Map<String, dynamic> json);
}
