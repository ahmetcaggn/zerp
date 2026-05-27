//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_list_stock_operation_dto.dart';

class HistoryOperationTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const HistoryOperationTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ENTRY = HistoryOperationTypeEnum._(r'ENTRY');
  static const ADJUSTMENT = HistoryOperationTypeEnum._(r'ADJUSTMENT');

  /// List of all possible values in this [enum][HistoryOperationTypeEnum].
  static const values = <HistoryOperationTypeEnum>[
    ENTRY,
    ADJUSTMENT,
  ];

  static HistoryOperationTypeEnum? fromJson(dynamic value) => HistoryOperationTypeEnumTypeTransformer().decode(value);
}

/// Transformation class that can [encode] an instance of [HistoryOperationTypeEnum] to String,
/// and [decode] dynamic data back to [HistoryOperationTypeEnum].
class HistoryOperationTypeEnumTypeTransformer {
  factory HistoryOperationTypeEnumTypeTransformer() => _instance ??= const HistoryOperationTypeEnumTypeTransformer._();

  const HistoryOperationTypeEnumTypeTransformer._();

  String encode(HistoryOperationTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a HistoryOperationTypeEnum.
  HistoryOperationTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ENTRY': return HistoryOperationTypeEnum.ENTRY;
        case r'ADJUSTMENT': return HistoryOperationTypeEnum.ADJUSTMENT;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [HistoryOperationTypeEnumTypeTransformer] instance.
  static HistoryOperationTypeEnumTypeTransformer? _instance;
}



///
/// GET /resource/stock-operations/history
class HistoryCommand extends OpenapiDefinitionBaseRequest<ApiResponseListStockOperationDTO> {
  HistoryCommand({
    required this.shopId,
    this.operationType,
    this.from,
    this.to,
    this.referenceNo,
    this.limit,
  });

  final String shopId;
  final HistoryOperationTypeEnum? operationType;
  final DateTime? from;
  final DateTime? to;
  final String? referenceNo;
  final int? limit;

  @override
  String get path {
    var p = r'/resource/stock-operations/history';
    return p;
  }

  @override
  List<QueryParameter> get queryParameters => [
    QueryParameter(key: r'shopId', value: shopId),
    if (operationType != null) QueryParameter(key: r'operationType', value: operationType!.value),
    if (from != null) QueryParameter(key: r'from', value: from),
    if (to != null) QueryParameter(key: r'to', value: to),
    if (referenceNo != null) QueryParameter(key: r'referenceNo', value: referenceNo),
    if (limit != null) QueryParameter(key: r'limit', value: limit),
  ];

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponseListStockOperationDTO> get defaultResponseFactory => ApiResponseListStockOperationDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponseListStockOperationDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
