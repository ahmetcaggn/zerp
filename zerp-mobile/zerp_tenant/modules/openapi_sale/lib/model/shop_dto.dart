//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';
import 'package:json_annotation/json_annotation.dart';
import 'shop_working_hour_dto.dart';


part 'shop_dto.g.dart';



@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ShopDTO extends Schema {
  /// Returns a new [ShopDTO] instance.
  ShopDTO({
    this.id,
    this.name,
    this.description,
    this.imageId,
    this.address,
    this.city,
    this.state,
    this.country,
    this.postalCode,
    this.phone,
    this.email,
    this.website,
    this.latitude,
    this.longitude,
    this.cuisineCategories = const {},
    this.workingHours = const [],
    this.defaultMenuLanguage,
    this.tenantId,
  });

  @JsonKey(name: r'id')
  final String? id;

  @JsonKey(name: r'name')
  final String? name;

  @JsonKey(name: r'description')
  final String? description;

  @JsonKey(name: r'imageId')
  final String? imageId;

  @JsonKey(name: r'address')
  final String? address;

  @JsonKey(name: r'city')
  final String? city;

  @JsonKey(name: r'state')
  final String? state;

  @JsonKey(name: r'country')
  final String? country;

  @JsonKey(name: r'postalCode')
  final String? postalCode;

  @JsonKey(name: r'phone')
  final String? phone;

  @JsonKey(name: r'email')
  final String? email;

  @JsonKey(name: r'website')
  final String? website;

  @JsonKey(name: r'latitude')
  final double? latitude;

  @JsonKey(name: r'longitude')
  final double? longitude;

  @JsonKey(name: r'cuisineCategories')
  final Set<ShopDTOCuisineCategoriesEnum> cuisineCategories;

  @JsonKey(name: r'workingHours')
  final List<ShopWorkingHourDTO> workingHours;

  @JsonKey(name: r'defaultMenuLanguage')
  final ShopDTODefaultMenuLanguageEnum? defaultMenuLanguage;

  @JsonKey(name: r'tenantId')
  final String? tenantId;

  /// The factory instance for creating [ShopDTO] from JSON.
  static const factory = ShopDTOFactory();

  factory ShopDTO.fromJson(Map<String, dynamic> json) => _$ShopDTOFromJson(json);

  Map<String, dynamic> toJson() => _$ShopDTOToJson(this);

  static List<ShopDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ShopDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ShopDTO.fromJson(row as Map<String, dynamic>);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ShopDTO> mapFromJson(dynamic json) {
    final map = <String, ShopDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ShopDTO.fromJson(entry.value as Map<String, dynamic>);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }
}

class ShopDTOFactory extends JsonSchemaFactory<ShopDTO> {
  const ShopDTOFactory();

  @override
  ShopDTO fromJson(dynamic json) => ShopDTO.fromJson(json as Map<String, dynamic>);
}



enum ShopDTOCuisineCategoriesEnum {
@JsonValue('BURGER')
BURGER('BURGER'),
@JsonValue('DONER')
DONER('DONER'),
@JsonValue('PIZZA')
PIZZA('PIZZA'),
@JsonValue('PIDE_LAHMACUN')
PIDE_LAHMACUN('PIDE_LAHMACUN'),
@JsonValue('CIG_KOFTE')
CIG_KOFTE('CIG_KOFTE'),
@JsonValue('SOKAK_LEZZETLERI')
SOKAK_LEZZETLERI('SOKAK_LEZZETLERI'),
@JsonValue('KOFTE')
KOFTE('KOFTE'),
@JsonValue('SALATA_SAGLIK')
SALATA_SAGLIK('SALATA_SAGLIK'),
@JsonValue('TATLI')
TATLI('TATLI'),
@JsonValue('TAVUK')
TAVUK('TAVUK'),
@JsonValue('MANTI_MAKARNA')
MANTI_MAKARNA('MANTI_MAKARNA'),
@JsonValue('TANTUNI')
TANTUNI('TANTUNI'),
@JsonValue('EV_YEMEKLERI')
EV_YEMEKLERI('EV_YEMEKLERI'),
@JsonValue('TOST_SANDVIC')
TOST_SANDVIC('TOST_SANDVIC'),
@JsonValue('KEBAP')
KEBAP('KEBAP'),
@JsonValue('KAHVE_ICECEK')
KAHVE_ICECEK('KAHVE_ICECEK'),
@JsonValue('PASTANE_FIRIN')
PASTANE_FIRIN('PASTANE_FIRIN'),
@JsonValue('CORBA')
CORBA('CORBA'),
@JsonValue('DUNYA_MUTFAGI_CAFE')
DUNYA_MUTFAGI_CAFE('DUNYA_MUTFAGI_CAFE'),
@JsonValue('UZAK_DOGU')
UZAK_DOGU('UZAK_DOGU'),
@JsonValue('MEZE')
MEZE('MEZE'),
@JsonValue('BALIK_DENIZ_URUNLERI')
BALIK_DENIZ_URUNLERI('BALIK_DENIZ_URUNLERI'),
@JsonValue('BOREK')
BOREK('BOREK'),
@JsonValue('STEAK')
STEAK('STEAK'),
@JsonValue('KAHVALTI')
KAHVALTI('KAHVALTI'),
@JsonValue('DONDURMA')
DONDURMA('DONDURMA');

const ShopDTOCuisineCategoriesEnum(this.value);

final String value;

@override
String toString() => value;
}



enum ShopDTODefaultMenuLanguageEnum {
@JsonValue('TR')
TR('TR'),
@JsonValue('EN')
EN('EN');

const ShopDTODefaultMenuLanguageEnum(this.value);

final String value;

@override
String toString() => value;
}




