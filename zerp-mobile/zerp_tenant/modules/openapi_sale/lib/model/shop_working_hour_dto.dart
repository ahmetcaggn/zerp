//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';


part 'shop_working_hour_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopWorkingHourDTO extends Schema {
  /// Returns a new [ShopWorkingHourDTO] instance.
  ShopWorkingHourDTO({
    this.dayOfWeek,
    this.opensAt,
    this.closesAt,
    this.openAllDay,
  });

  @JsonKey(name: r'dayOfWeek')
  final ShopWorkingHourDTODayOfWeekEnum? dayOfWeek;

  @JsonKey(name: r'opensAt')
  final String? opensAt;

  @JsonKey(name: r'closesAt')
  final String? closesAt;

  @JsonKey(name: r'openAllDay')
  final bool? openAllDay;

  /// The factory instance for creating [ShopWorkingHourDTO] from JSON.
  static const factory = ShopWorkingHourDTOFactory();

  factory ShopWorkingHourDTO.fromJson(Map<String, dynamic> json) => _$ShopWorkingHourDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopWorkingHourDTOToJson(this);

  static List<ShopWorkingHourDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopWorkingHourDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopWorkingHourDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopWorkingHourDTO> mapFromJson(dynamic json) {
    final map = <String, ShopWorkingHourDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopWorkingHourDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopWorkingHourDTOFactory extends JsonSchemaFactory<ShopWorkingHourDTO> {
  const ShopWorkingHourDTOFactory();

  @override
  ShopWorkingHourDTO fromJson(dynamic json) => ShopWorkingHourDTO.fromJson(json as Map<String, dynamic>);
}



enum ShopWorkingHourDTODayOfWeekEnum {
@JsonValue('MONDAY')
MONDAY('MONDAY'),
@JsonValue('TUESDAY')
TUESDAY('TUESDAY'),
@JsonValue('WEDNESDAY')
WEDNESDAY('WEDNESDAY'),
@JsonValue('THURSDAY')
THURSDAY('THURSDAY'),
@JsonValue('FRIDAY')
FRIDAY('FRIDAY'),
@JsonValue('SATURDAY')
SATURDAY('SATURDAY'),
@JsonValue('SUNDAY')
SUNDAY('SUNDAY');

const ShopWorkingHourDTODayOfWeekEnum(this.value);

final String value;

@override
String toString() => value;
}




