//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'create_ticket_request.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CreateTicketRequest extends Schema {
  /// Returns a new [CreateTicketRequest] instance.
  CreateTicketRequest({
    this.title,
    this.description,
    this.priority,
    this.type,
  });

  @JsonKey(name: r'title')
  final String? title;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'priority')
  final CreateTicketRequestPriorityEnum? priority;

  @JsonKey(name: r'type')
  final CreateTicketRequestTypeEnum? type;

  /// The factory instance for creating [CreateTicketRequest] from JSON.
  static const factory = CreateTicketRequestFactory();

  factory CreateTicketRequest.fromJson(Map<String, dynamic> json) => _$CreateTicketRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateTicketRequestToJson(this);

  static List<CreateTicketRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateTicketRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateTicketRequest.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreateTicketRequest> mapFromJson(dynamic json) {
    final map = <String, CreateTicketRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreateTicketRequest.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class CreateTicketRequestFactory extends JsonSchemaFactory<CreateTicketRequest> {
  const CreateTicketRequestFactory();

  @override
  CreateTicketRequest fromJson(dynamic json) => CreateTicketRequest.fromJson(json as Map<String, dynamic>);
}



enum CreateTicketRequestPriorityEnum {
@JsonValue('LOW')
LOW('LOW'),
@JsonValue('MEDIUM')
MEDIUM('MEDIUM'),
@JsonValue('HIGH')
HIGH('HIGH'),
@JsonValue('CRITICAL')
CRITICAL('CRITICAL');

const CreateTicketRequestPriorityEnum(this.value);

final String value;

@override
String toString() => value;
}



enum CreateTicketRequestTypeEnum {
@JsonValue('SERVICE_LEVEL')
SERVICE_LEVEL('SERVICE_LEVEL'),
@JsonValue('QUESTION')
QUESTION('QUESTION');

const CreateTicketRequestTypeEnum(this.value);

final String value;

@override
String toString() => value;
}




