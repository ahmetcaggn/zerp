//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'add_member_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AddMemberRequest extends Schema {
  /// Returns a new [AddMemberRequest] instance.
  AddMemberRequest({
    this.userId,
    this.role,
  });

  @JsonKey(name: r'userId')
  final String? userId;

  @JsonKey(name: r'role')
  final AddMemberRequestRoleEnum? role;

  /// The factory instance for creating [AddMemberRequest] from JSON.
  static const factory = AddMemberRequestFactory();

  factory AddMemberRequest.fromJson(Map<String, dynamic> json) => _$AddMemberRequestFromJson(json);

  Map<String, dynamic> toJson() => _$AddMemberRequestToJson(this);

  static List<AddMemberRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AddMemberRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AddMemberRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AddMemberRequest> mapFromJson(dynamic json) {
    final map = <String, AddMemberRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AddMemberRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class AddMemberRequestFactory extends JsonSchemaFactory<AddMemberRequest> {
  const AddMemberRequestFactory();

  @override
  AddMemberRequest fromJson(dynamic json) => AddMemberRequest.fromJson(json as Map<String, dynamic>);
}



enum AddMemberRequestRoleEnum {
@JsonValue(r'LEADER')
LEADER(r'LEADER'),
@JsonValue(r'MEMBER')
MEMBER(r'MEMBER');

const AddMemberRequestRoleEnum(this.value);

final String value;

@override
String toString() => value;
}




