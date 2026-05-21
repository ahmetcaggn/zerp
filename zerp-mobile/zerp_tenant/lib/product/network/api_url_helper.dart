import 'package:openapi_crm/api.dart' as crm;
import 'package:openapi_employee/api.dart' as employee;
import 'package:openapi_notification/api.dart' as notification;
import 'package:openapi_resource/api.dart' as resource;
import 'package:openapi_sale/api.dart' as sale;
import 'package:openapi_suggestion/api.dart' as suggestion;
import 'package:openapi_user/api.dart' as user;

abstract final class ApiUrlHelper {
  const ApiUrlHelper._();

  /// Aggregates all base URLs from the OpenAPI modules into a unique list.
  static List<String> get allBaseUrls {
    final urls = <String>{
      ...crm.ApiConfig.serverUrls,
      ...employee.ApiConfig.serverUrls,
      ...notification.ApiConfig.serverUrls,
      ...resource.ApiConfig.serverUrls,
      ...sale.ApiConfig.serverUrls,
      ...suggestion.ApiConfig.serverUrls,
      ...user.ApiConfig.serverUrls,
    };
    return urls.toList();
  }

  /// Gets the default base URL (the first base URL from openapi modules).
  static String get defaultBaseUrl {
    return allBaseUrls.firstOrNull ?? 'https://zerpapi.femrek.dev';
  }
}
