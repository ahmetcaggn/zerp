//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:dart_network_layer_core/dart_network_layer_core.dart';

import '../../base/base_request.dart';

import '../../model/api_response_permission_group_response_dto.dart';

class GetPredefinedGroupCodeEnum {
  /// Instantiate a new enum with the provided [value].
  const GetPredefinedGroupCodeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const CASHIER = GetPredefinedGroupCodeEnum._(r'CASHIER');
  static const WAITER = GetPredefinedGroupCodeEnum._(r'WAITER');
  static const STOCK_MANAGER = GetPredefinedGroupCodeEnum._(r'STOCK_MANAGER');
  static const CATALOG_MANAGER = GetPredefinedGroupCodeEnum._(r'CATALOG_MANAGER');
  static const TENANT_SUPERVISOR = GetPredefinedGroupCodeEnum._(r'TENANT_SUPERVISOR');

  /// List of all possible values in this [enum][GetPredefinedGroupCodeEnum].
  static const values = <GetPredefinedGroupCodeEnum>[
    CASHIER,
    WAITER,
    STOCK_MANAGER,
    CATALOG_MANAGER,
    TENANT_SUPERVISOR,
  ];

  static GetPredefinedGroupCodeEnum? fromJson(dynamic value) => GetPredefinedGroupCodeEnumTypeTransformer().decode(value);
}

/// Transformation class that can [encode] an instance of [GetPredefinedGroupCodeEnum] to String,
/// and [decode] dynamic data back to [GetPredefinedGroupCodeEnum].
class GetPredefinedGroupCodeEnumTypeTransformer {
  factory GetPredefinedGroupCodeEnumTypeTransformer() => _instance ??= const GetPredefinedGroupCodeEnumTypeTransformer._();

  const GetPredefinedGroupCodeEnumTypeTransformer._();

  String encode(GetPredefinedGroupCodeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a GetPredefinedGroupCodeEnum.
  GetPredefinedGroupCodeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'CASHIER': return GetPredefinedGroupCodeEnum.CASHIER;
        case r'WAITER': return GetPredefinedGroupCodeEnum.WAITER;
        case r'STOCK_MANAGER': return GetPredefinedGroupCodeEnum.STOCK_MANAGER;
        case r'CATALOG_MANAGER': return GetPredefinedGroupCodeEnum.CATALOG_MANAGER;
        case r'TENANT_SUPERVISOR': return GetPredefinedGroupCodeEnum.TENANT_SUPERVISOR;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [GetPredefinedGroupCodeEnumTypeTransformer] instance.
  static GetPredefinedGroupCodeEnumTypeTransformer? _instance;
}



///
/// GET /user/permission-groups/predefined/{code}
class GetPredefinedGroupCommand extends OpenapiDefinitionBaseRequest<ApiResponsePermissionGroupResponseDTO> {
  GetPredefinedGroupCommand({
    required this.code,
  });

  final GetPredefinedGroupCodeEnum code;

  @override
  String get path {
    var p = r'/user/permission-groups/predefined/{code}';
    p = p.replaceAll('{code}', code.value.toString());
    return p;
  }

  @override
  HttpRequestMethod get method => HttpRequestMethod.get;

  @override
  SchemaFactory<ApiResponsePermissionGroupResponseDTO> get defaultResponseFactory => ApiResponsePermissionGroupResponseDTO.factory;

  @override
  SchemaFactory get defaultErrorResponseFactory => AnyDataSchema.factory;

  @override
  Map<int, SchemaFactory> get responseFactories => {
    200: ApiResponsePermissionGroupResponseDTO.factory,
  };

  @override
  RequestSchema get payload =>
      const EmptyRequestSchema();
}
