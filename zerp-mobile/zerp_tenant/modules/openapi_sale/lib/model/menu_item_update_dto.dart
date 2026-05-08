//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

class MenuItemUpdateDTO extends Schema {
  /// Returns a new [MenuItemUpdateDTO] instance.
  MenuItemUpdateDTO({
    this.name,
    this.description,
    this.price,
    this.imageId,
    this.productIds = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? name;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? description;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final num? price;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  final String? imageId;

  final List<String> productIds;

  /// The factory instance for creating [MenuItemUpdateDTO] from JSON.
  static const factory = MenuItemUpdateDTOFactory();

  @override
  bool operator ==(Object other) => identical(this, other) || other is MenuItemUpdateDTO &&
    other.name == name &&
    other.description == description &&
    other.price == price &&
    other.imageId == imageId &&
    other.productIds == productIds;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name == null ? 0 : name!.hashCode) +
    (description == null ? 0 : description!.hashCode) +
    (price == null ? 0 : price!.hashCode) +
    (imageId == null ? 0 : imageId!.hashCode) +
    (productIds.hashCode);

  @override
  String toString() => 'MenuItemUpdateDTO[name=$name, description=$description, price=$price, imageId=$imageId, productIds=$productIds]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.price != null) {
      json[r'price'] = this.price;
    } else {
      json[r'price'] = null;
    }
    if (this.imageId != null) {
      json[r'imageId'] = this.imageId;
    } else {
      json[r'imageId'] = null;
    }
      json[r'productIds'] = this.productIds;
    return json;
  }

  /// Returns a new [MenuItemUpdateDTO] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static MenuItemUpdateDTO? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "MenuItemUpdateDTO[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "MenuItemUpdateDTO[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return MenuItemUpdateDTO(
        name: json[r'name'] is String ? json[r'name'] as String : null,
        description: json[r'description'] is String ? json[r'description'] as String : null,
        price: num.parse('${json[r'price']}'),
        imageId: json[r'imageId'] is String ? json[r'imageId'] as String : null,
        productIds: json[r'productIds'] is Iterable
            ? (json[r'productIds'] as Iterable).cast<String>().toList(growable: false)
            : const [],
      );
    }
    return null;
  }

  static List<MenuItemUpdateDTO> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <MenuItemUpdateDTO>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = MenuItemUpdateDTO.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, MenuItemUpdateDTO> mapFromJson(dynamic json) {
    final map = <String, MenuItemUpdateDTO>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = MenuItemUpdateDTO.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of MenuItemUpdateDTO-objects as value to a dart map
  static Map<String, List<MenuItemUpdateDTO>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<MenuItemUpdateDTO>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = MenuItemUpdateDTO.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

/// Factory for creating [MenuItemUpdateDTO] instances from JSON data.
class MenuItemUpdateDTOFactory extends JsonSchemaFactory<MenuItemUpdateDTO> {
  const MenuItemUpdateDTOFactory();

  @override
  MenuItemUpdateDTO fromJson(dynamic json) => MenuItemUpdateDTO.fromJson(json)!;
}

