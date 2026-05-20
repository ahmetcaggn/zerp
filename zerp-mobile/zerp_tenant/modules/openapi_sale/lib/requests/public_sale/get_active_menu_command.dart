//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_public_shop_menu_response_dto.dart';

class GetActiveMenuLanguageEnum {
  /// Instantiate a new enum with the provided [value].
  const GetActiveMenuLanguageEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const TR = GetActiveMenuLanguageEnum._(r'TR');
  static const EN = GetActiveMenuLanguageEnum._(r'EN');

  /// List of all possible values in this [enum][GetActiveMenuLanguageEnum].
  static const values = <GetActiveMenuLanguageEnum>[
    TR,
    EN,
  ];

  static GetActiveMenuLanguageEnum? fromJson(dynamic value) => GetActiveMenuLanguageEnumTypeTransformer().decode(value);
}

/// Transformation class that can [encode] an instance of [GetActiveMenuLanguageEnum] to String,
/// and [decode] dynamic data back to [GetActiveMenuLanguageEnum].
class GetActiveMenuLanguageEnumTypeTransformer {
  factory GetActiveMenuLanguageEnumTypeTransformer() => _instance ??= const GetActiveMenuLanguageEnumTypeTransformer._();

  const GetActiveMenuLanguageEnumTypeTransformer._();

  String encode(GetActiveMenuLanguageEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a GetActiveMenuLanguageEnum.
  GetActiveMenuLanguageEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'TR': return GetActiveMenuLanguageEnum.TR;
        case r'EN': return GetActiveMenuLanguageEnum.EN;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [GetActiveMenuLanguageEnumTypeTransformer] instance.
  static GetActiveMenuLanguageEnumTypeTransformer? _instance;
}



///
/// GET /sale/public/shops/{shopId}/menu
class GetActiveMenuCommand extends OpenapiDefinitionBaseRequest<ApiResponsePublicShopMenuResponseDTO> {
  GetActiveMenuCommand({
    required this.shopId,
    this.language,
  });

  final String shopId;
  final GetActiveMenuLanguageEnum? language;

  @override
  String get path {
    var p = r'/sale/public/shops/{shopId}/menu';
    p = p.replaceAll('{shopId}', shopId);
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    if (language != null) QueryParameter(key: r'language', value: language!.value),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponsePublicShopMenuResponseDTO> get defaultResponseFactory => ApiResponsePublicShopMenuResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponsePublicShopMenuResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
