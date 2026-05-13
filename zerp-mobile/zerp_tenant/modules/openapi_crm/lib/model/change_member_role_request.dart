//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'change_member_role_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ChangeMemberRoleRequest extends Schema {
  /// Returns a new [ChangeMemberRoleRequest] instance.
  ChangeMemberRoleRequest({
    this.role,
  });

  @JsonKey(name: r'role')
  final ChangeMemberRoleRequestRoleEnum? role;

  /// The factory instance for creating [ChangeMemberRoleRequest] from JSON.
  static const factory = ChangeMemberRoleRequestFactory();

  factory ChangeMemberRoleRequest.fromJson(Map<String, dynamic> json) => _$ChangeMemberRoleRequestFromJson(json);

  Map<String, dynamic> toJson() => _$ChangeMemberRoleRequestToJson(this);

  static List<ChangeMemberRoleRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ChangeMemberRoleRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangeMemberRoleRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ChangeMemberRoleRequest> mapFromJson(dynamic json) {
    final map = <String, ChangeMemberRoleRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ChangeMemberRoleRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ChangeMemberRoleRequestFactory extends JsonSchemaFactory<ChangeMemberRoleRequest> {
  const ChangeMemberRoleRequestFactory();

  @override
  ChangeMemberRoleRequest fromJson(dynamic json) => ChangeMemberRoleRequest.fromJson(json as Map<String, dynamic>);
}



enum ChangeMemberRoleRequestRoleEnum {
@JsonValue(r'LEADER')
LEADER(r'LEADER'),
@JsonValue(r'MEMBER')
MEMBER(r'MEMBER');

const ChangeMemberRoleRequestRoleEnum(this.value);

final String value;

@override
String toString() => value;
}




