//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'attachment_response.dart';


part 'comment_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CommentResponse extends Schema {
  /// Returns a new [CommentResponse] instance.
  CommentResponse({
    this.id,
    this.authorId,
    this.authorName,
    this.authorType,
    this.content,
    this.isInternal,
    this.createdAt,
    this.attachments = const [],
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'authorId')
  final String? authorId;

  @JsonKey(name: r'authorName')
  final String? authorName;

  @JsonKey(name: r'authorType')
  final String? authorType;

  @JsonKey(name: r'content')
  final String? content;

  @JsonKey(name: r'isInternal')
  final bool? isInternal;

  @JsonKey(name: r'createdAt')
  final DateTime? createdAt;

  @JsonKey(name: r'attachments')
  final List<AttachmentResponse> attachments;

  /// The factory instance for creating [CommentResponse] from JSON.
  static const factory = CommentResponseFactory();

  factory CommentResponse.fromJson(Map<String, dynamic> json) => _$CommentResponseFromJson(json);

  Map<String, dynamic> toJson() => _$CommentResponseToJson(this);

  static List<CommentResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CommentResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CommentResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CommentResponse> mapFromJson(dynamic json) {
    final map = <String, CommentResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CommentResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class CommentResponseFactory extends JsonSchemaFactory<CommentResponse> {
  const CommentResponseFactory();

  @override
  CommentResponse fromJson(dynamic json) => CommentResponse.fromJson(json as Map<String, dynamic>);
}




