//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_list_public_menu_item_dto.dart';

class GetCategoryMenuItemsLanguageEnum {
  /// Instantiate a new enum with the provided [value].
  const GetCategoryMenuItemsLanguageEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const TR = GetCategoryMenuItemsLanguageEnum._(r'TR');
  static const EN = GetCategoryMenuItemsLanguageEnum._(r'EN');

  /// List of all possible values in this [enum][GetCategoryMenuItemsLanguageEnum].
  static const values = <GetCategoryMenuItemsLanguageEnum>[
    TR,
    EN,
  ];

  static GetCategoryMenuItemsLanguageEnum? fromJson(dynamic value) => GetCategoryMenuItemsLanguageEnumTypeTransformer().decode(value);
}

/// Transformation class that can [encode] an instance of [GetCategoryMenuItemsLanguageEnum] to String,
/// and [decode] dynamic data back to [GetCategoryMenuItemsLanguageEnum].
class GetCategoryMenuItemsLanguageEnumTypeTransformer {
  factory GetCategoryMenuItemsLanguageEnumTypeTransformer() => _instance ??= const GetCategoryMenuItemsLanguageEnumTypeTransformer._();

  const GetCategoryMenuItemsLanguageEnumTypeTransformer._();

  String encode(GetCategoryMenuItemsLanguageEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a GetCategoryMenuItemsLanguageEnum.
  GetCategoryMenuItemsLanguageEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'TR': return GetCategoryMenuItemsLanguageEnum.TR;
        case r'EN': return GetCategoryMenuItemsLanguageEnum.EN;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [GetCategoryMenuItemsLanguageEnumTypeTransformer] instance.
  static GetCategoryMenuItemsLanguageEnumTypeTransformer? _instance;
}



///
/// GET /sale/public/shops/{shopId}/categories/{categoryId}/menu-items
class GetCategoryMenuItemsCommand extends OpenapiDefinitionBaseRequest<ApiResponseListPublicMenuItemDTO> {
  GetCategoryMenuItemsCommand({
    required this.shopId,
    required this.categoryId,
    this.language,
    this.start,
    this.end,
    this.sort,
    this.order,
  });

  final String shopId;
  final String categoryId;
  final GetCategoryMenuItemsLanguageEnum? language;
  final int? start;
  final int? end;
  final String? sort;
  final String? order;

  @override
  String get path {
    var p = r'/sale/public/shops/{shopId}/categories/{categoryId}/menu-items';
    p = p.replaceAll('{shopId}', shopId);
    p = p.replaceAll('{categoryId}', categoryId);
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    if (language != null) QueryParameter(key: r'language', value: language!.value),
    if (start != null) QueryParameter(key: r'_start', value: start),
    if (end != null) QueryParameter(key: r'_end', value: end),
    if (sort != null) QueryParameter(key: r'_sort', value: sort),
    if (order != null) QueryParameter(key: r'_order', value: order),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseListPublicMenuItemDTO> get defaultResponseFactory => ApiResponseListPublicMenuItemDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseListPublicMenuItemDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
