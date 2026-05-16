//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'change_status_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ChangeStatusRequest extends Schema {
  /// Returns a new [ChangeStatusRequest] instance.
  ChangeStatusRequest({
    this.status,
  });

  @JsonKey(name: r'status')
  final ChangeStatusRequestStatusEnum? status;

  /// The factory instance for creating [ChangeStatusRequest] from JSON.
  static const factory = ChangeStatusRequestFactory();

  factory ChangeStatusRequest.fromJson(Map<String, dynamic> json) => _$ChangeStatusRequestFromJson(json);

  Map<String, dynamic> toJson() => _$ChangeStatusRequestToJson(this);

  static List<ChangeStatusRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ChangeStatusRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangeStatusRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ChangeStatusRequest> mapFromJson(dynamic json) {
    final map = <String, ChangeStatusRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ChangeStatusRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ChangeStatusRequestFactory extends JsonSchemaFactory<ChangeStatusRequest> {
  const ChangeStatusRequestFactory();

  @override
  ChangeStatusRequest fromJson(dynamic json) => ChangeStatusRequest.fromJson(json as Map<String, dynamic>);
}



enum ChangeStatusRequestStatusEnum {
@JsonValue('OPEN')
OPEN('OPEN'),
@JsonValue('IN_PROGRESS')
IN_PROGRESS('IN_PROGRESS'),
@JsonValue('WAITING_CUSTOMER')
WAITING_CUSTOMER('WAITING_CUSTOMER'),
@JsonValue('RESOLVED')
RESOLVED('RESOLVED'),
@JsonValue('CLOSED')
CLOSED('CLOSED'),
@JsonValue('CANCELLED')
CANCELLED('CANCELLED');

const ChangeStatusRequestStatusEnum(this.value);

final String value;

@override
String toString() => value;
}




