//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_public_shop_feed_response_dto.dart';

class GetShopsFeedModeEnum {
  /// Instantiate a new enum with the provided [value].
  const GetShopsFeedModeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ALL = GetShopsFeedModeEnum._(r'ALL');
  static const NEARBY = GetShopsFeedModeEnum._(r'NEARBY');

  /// List of all possible values in this [enum][GetShopsFeedModeEnum].
  static const values = <GetShopsFeedModeEnum>[
    ALL,
    NEARBY,
  ];

  static GetShopsFeedModeEnum? fromJson(dynamic value) => GetShopsFeedModeEnumTypeTransformer().decode(value);
}

/// Transformation class that can [encode] an instance of [GetShopsFeedModeEnum] to String,
/// and [decode] dynamic data back to [GetShopsFeedModeEnum].
class GetShopsFeedModeEnumTypeTransformer {
  factory GetShopsFeedModeEnumTypeTransformer() => _instance ??= const GetShopsFeedModeEnumTypeTransformer._();

  const GetShopsFeedModeEnumTypeTransformer._();

  String encode(GetShopsFeedModeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a GetShopsFeedModeEnum.
  GetShopsFeedModeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ALL': return GetShopsFeedModeEnum.ALL;
        case r'NEARBY': return GetShopsFeedModeEnum.NEARBY;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [GetShopsFeedModeEnumTypeTransformer] instance.
  static GetShopsFeedModeEnumTypeTransformer? _instance;
}


class GetShopsFeedSortByEnum {
  /// Instantiate a new enum with the provided [value].
  const GetShopsFeedSortByEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const NAME = GetShopsFeedSortByEnum._(r'NAME');
  static const DISTANCE = GetShopsFeedSortByEnum._(r'DISTANCE');

  /// List of all possible values in this [enum][GetShopsFeedSortByEnum].
  static const values = <GetShopsFeedSortByEnum>[
    NAME,
    DISTANCE,
  ];

  static GetShopsFeedSortByEnum? fromJson(dynamic value) => GetShopsFeedSortByEnumTypeTransformer().decode(value);
}

/// Transformation class that can [encode] an instance of [GetShopsFeedSortByEnum] to String,
/// and [decode] dynamic data back to [GetShopsFeedSortByEnum].
class GetShopsFeedSortByEnumTypeTransformer {
  factory GetShopsFeedSortByEnumTypeTransformer() => _instance ??= const GetShopsFeedSortByEnumTypeTransformer._();

  const GetShopsFeedSortByEnumTypeTransformer._();

  String encode(GetShopsFeedSortByEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a GetShopsFeedSortByEnum.
  GetShopsFeedSortByEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'NAME': return GetShopsFeedSortByEnum.NAME;
        case r'DISTANCE': return GetShopsFeedSortByEnum.DISTANCE;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [GetShopsFeedSortByEnumTypeTransformer] instance.
  static GetShopsFeedSortByEnumTypeTransformer? _instance;
}


class GetShopsFeedOrderEnum {
  /// Instantiate a new enum with the provided [value].
  const GetShopsFeedOrderEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ASC = GetShopsFeedOrderEnum._(r'ASC');
  static const DESC = GetShopsFeedOrderEnum._(r'DESC');

  /// List of all possible values in this [enum][GetShopsFeedOrderEnum].
  static const values = <GetShopsFeedOrderEnum>[
    ASC,
    DESC,
  ];

  static GetShopsFeedOrderEnum? fromJson(dynamic value) => GetShopsFeedOrderEnumTypeTransformer().decode(value);
}

/// Transformation class that can [encode] an instance of [GetShopsFeedOrderEnum] to String,
/// and [decode] dynamic data back to [GetShopsFeedOrderEnum].
class GetShopsFeedOrderEnumTypeTransformer {
  factory GetShopsFeedOrderEnumTypeTransformer() => _instance ??= const GetShopsFeedOrderEnumTypeTransformer._();

  const GetShopsFeedOrderEnumTypeTransformer._();

  String encode(GetShopsFeedOrderEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a GetShopsFeedOrderEnum.
  GetShopsFeedOrderEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ASC': return GetShopsFeedOrderEnum.ASC;
        case r'DESC': return GetShopsFeedOrderEnum.DESC;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [GetShopsFeedOrderEnumTypeTransformer] instance.
  static GetShopsFeedOrderEnumTypeTransformer? _instance;
}



///
/// GET /sale/public/shops/feed
class GetShopsFeedCommand extends OpenapiDefinitionBaseRequest<ApiResponsePublicShopFeedResponseDTO> {
  GetShopsFeedCommand({
    this.mode,
    this.page,
    this.pageSize,
    this.q,
    this.city,
    this.state,
    this.sortBy,
    this.order,
    this.lat,
    this.lng,
  });

  final GetShopsFeedModeEnum? mode;
  final int? page;
  final int? pageSize;
  final String? q;
  final String? city;
  final String? state;
  final GetShopsFeedSortByEnum? sortBy;
  final GetShopsFeedOrderEnum? order;
  final double? lat;
  final double? lng;

  @override
  String get path {
    var p = r'/sale/public/shops/feed';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    if (mode != null) QueryParameter(key: r'mode', value: mode!.value),
    if (page != null) QueryParameter(key: r'page', value: page),
    if (pageSize != null) QueryParameter(key: r'pageSize', value: pageSize),
    if (q != null) QueryParameter(key: r'q', value: q),
    if (city != null) QueryParameter(key: r'city', value: city),
    if (state != null) QueryParameter(key: r'state', value: state),
    if (sortBy != null) QueryParameter(key: r'sortBy', value: sortBy!.value),
    if (order != null) QueryParameter(key: r'order', value: order!.value),
    if (lat != null) QueryParameter(key: r'lat', value: lat),
    if (lng != null) QueryParameter(key: r'lng', value: lng),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponsePublicShopFeedResponseDTO> get defaultResponseFactory => ApiResponsePublicShopFeedResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponsePublicShopFeedResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
