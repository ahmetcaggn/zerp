//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'attachment_response.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AttachmentResponse extends Schema {
  /// Returns a new [AttachmentResponse] instance.
  AttachmentResponse({
    this.id,
    this.fileName,
    this.fileSize,
    this.contentType,
    this.storageKey,
    this.uploadedBy,
    this.uploadedAt,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'fileName')
  final String? fileName;

  @JsonKey(name: r'fileSize')
  final int? fileSize;

  @JsonKey(name: r'contentType')
  final String? contentType;

  @JsonKey(name: r'storageKey')
  final String? storageKey;

  @JsonKey(name: r'uploadedBy')
  final int? uploadedBy;

  @JsonKey(name: r'uploadedAt')
  final DateTime? uploadedAt;

  /// The factory instance for creating [AttachmentResponse] from JSON.
  static const factory = AttachmentResponseFactory();

  factory AttachmentResponse.fromJson(Map<String, dynamic> json) => _$AttachmentResponseFromJson(json);

  Map<String, dynamic> toJson() => _$AttachmentResponseToJson(this);

  static List<AttachmentResponse> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AttachmentResponse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AttachmentResponse.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AttachmentResponse> mapFromJson(dynamic json) {
    final map = <String, AttachmentResponse>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AttachmentResponse.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class AttachmentResponseFactory extends JsonSchemaFactory<AttachmentResponse> {
  const AttachmentResponseFactory();

  @override
  AttachmentResponse fromJson(dynamic json) => AttachmentResponse.fromJson(json as Map<String, dynamic>);
}




