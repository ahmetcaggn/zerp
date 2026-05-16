//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'parameter.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class Parameter extends Schema {
  /// Returns a new [Parameter] instance.
  Parameter({
    this.key,
    this.value,
  });

  @JsonKey(name: r'key')
  final String? key;

  @JsonKey(name: r'value')
  final String? value;

  /// The factory instance for creating [Parameter] from JSON.
  static const factory = ParameterFactory();

  factory Parameter.fromJson(Map<String, dynamic> json) => _$ParameterFromJson(json);

  Map<String, dynamic> toJson() => _$ParameterToJson(this);

  static List<Parameter> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <Parameter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Parameter.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Parameter> mapFromJson(dynamic json) {
    final map = <String, Parameter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Parameter.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ParameterFactory extends JsonSchemaFactory<Parameter> {
  const ParameterFactory();

  @override
  Parameter fromJson(dynamic json) => Parameter.fromJson(json as Map<String, dynamic>);
}




