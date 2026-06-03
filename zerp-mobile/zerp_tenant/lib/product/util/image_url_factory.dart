import 'package:meta/meta.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/network/api_url_helper.dart';
import 'package:zerp_tenant/product/network/network_invoker/api_network_invoker.dart';

enum ImageSize {
  original,
  small,
  medium,
  large,
}

sealed class ImageUrlFactory {
  const ImageUrlFactory();

  @visibleForTesting
  static String? testBaseUrl;

  String get urlOriginal;

  String get urlSmall;

  String get urlMedium;

  String get urlLarge;

  Logger get _log => Logger('ImageUrlFactory');

  String url(ImageSize size) {
    switch (size) {
      case ImageSize.original:
        return urlOriginal;
      case ImageSize.small:
        return urlSmall;
      case ImageSize.medium:
        return urlMedium;
      case ImageSize.large:
        return urlLarge;
    }
  }

  String get baseUrl {
    if (testBaseUrl != null) {
      final host = testBaseUrl!;
      return host.endsWith('/') ? host.substring(0, host.length - 1) : host;
    }
    String host;
    try {
      host = getIt<ApiNetworkInvoker>().dio.options.baseUrl;
    } on Object catch (e) {
      host = ApiUrlHelper.defaultBaseUrl;
      _log.warning(
        'Failed to retrieve baseUrl from ApiNetworkInvoker using GetIt. '
        'Falling back to defaultBaseUrl: $host. Error: $e',
      );
    }
    return host.endsWith('/') ? host.substring(0, host.length - 1) : host;
  }
}

final class MenuItemImageUrlFactory extends ImageUrlFactory
    with LoggerMixinConst<MenuItemImageUrlFactory> {
  const MenuItemImageUrlFactory(this.imageId);

  final String imageId;

  @override
  String get urlOriginal =>
      '$baseUrl/sale/public/images/$imageId?size=original';

  @override
  String get urlSmall => '$baseUrl/sale/public/images/$imageId?size=small';

  @override
  String get urlMedium => '$baseUrl/sale/public/images/$imageId?size=medium';

  @override
  String get urlLarge => '$baseUrl/sale/public/images/$imageId?size=large';
}

final class ShopImageUrlFactory extends ImageUrlFactory
    with LoggerMixinConst<ShopImageUrlFactory> {
  const ShopImageUrlFactory(this.shopId);

  final String shopId;

  @override
  String get urlOriginal => '$baseUrl/sale/shops/$shopId/image?size=original';

  @override
  String get urlSmall => '$baseUrl/sale/shops/$shopId/image?size=small';

  @override
  String get urlMedium => '$baseUrl/sale/shops/$shopId/image?size=medium';

  @override
  String get urlLarge => '$baseUrl/sale/shops/$shopId/image?size=large';
}
