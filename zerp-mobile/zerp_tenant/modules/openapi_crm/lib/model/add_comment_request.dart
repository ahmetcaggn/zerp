//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'add_comment_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AddCommentRequest extends Schema {
  /// Returns a new [AddCommentRequest] instance.
  AddCommentRequest({
    this.content,
    this.isInternal,
  });

  @JsonKey(name: r'content')
  final String? content;

  @JsonKey(name: r'isInternal')
  final bool? isInternal;

  /// The factory instance for creating [AddCommentRequest] from JSON.
  static const factory = AddCommentRequestFactory();

  factory AddCommentRequest.fromJson(Map<String, dynamic> json) => _$AddCommentRequestFromJson(json);

  Map<String, dynamic> toJson() => _$AddCommentRequestToJson(this);

  static List<AddCommentRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AddCommentRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AddCommentRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AddCommentRequest> mapFromJson(dynamic json) {
    final map = <String, AddCommentRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AddCommentRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class AddCommentRequestFactory extends JsonSchemaFactory<AddCommentRequest> {
  const AddCommentRequestFactory();

  @override
  AddCommentRequest fromJson(dynamic json) => AddCommentRequest.fromJson(json as Map<String, dynamic>);
}




