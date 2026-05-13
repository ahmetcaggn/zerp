//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'change_priority_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ChangePriorityRequest extends Schema {
  /// Returns a new [ChangePriorityRequest] instance.
  ChangePriorityRequest({
    this.priority,
  });

  @JsonKey(name: r'priority')
  final ChangePriorityRequestPriorityEnum? priority;

  /// The factory instance for creating [ChangePriorityRequest] from JSON.
  static const factory = ChangePriorityRequestFactory();

  factory ChangePriorityRequest.fromJson(Map<String, dynamic> json) => _$ChangePriorityRequestFromJson(json);

  Map<String, dynamic> toJson() => _$ChangePriorityRequestToJson(this);

  static List<ChangePriorityRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ChangePriorityRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangePriorityRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ChangePriorityRequest> mapFromJson(dynamic json) {
    final map = <String, ChangePriorityRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ChangePriorityRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ChangePriorityRequestFactory extends JsonSchemaFactory<ChangePriorityRequest> {
  const ChangePriorityRequestFactory();

  @override
  ChangePriorityRequest fromJson(dynamic json) => ChangePriorityRequest.fromJson(json as Map<String, dynamic>);
}



enum ChangePriorityRequestPriorityEnum {
@JsonValue(r'LOW')
LOW(r'LOW'),
@JsonValue(r'MEDIUM')
MEDIUM(r'MEDIUM'),
@JsonValue(r'HIGH')
HIGH(r'HIGH'),
@JsonValue(r'CRITICAL')
CRITICAL(r'CRITICAL');

const ChangePriorityRequestPriorityEnum(this.value);

final String value;

@override
String toString() => value;
}




