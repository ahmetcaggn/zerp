import 'package:flutter_test/flutter_test.dart';
import 'package:logging/logging.dart';
import 'package:zerp_tenant/product/network/api_url_helper.dart';
import 'package:zerp_tenant/product/util/image_url_factory.dart';

void main() {
  group('ImageUrlFactory Tests', () {
    setUp(() {
      ImageUrlFactory.testBaseUrl = null;
    });

    tearDown(() {
      ImageUrlFactory.testBaseUrl = null;
    });

    test(
      'Fallback to default base URL and '
      'logs warning when GetIt is not initialized',
      () async {
        final logRecords = <LogRecord>[];
        final subscription = Logger.root.onRecord.listen(logRecords.add);

        const factory = MenuItemImageUrlFactory('img123');
        final normalizedDefault = ApiUrlHelper.defaultBaseUrl.endsWith('/')
            ? ApiUrlHelper.defaultBaseUrl.substring(
                0,
                ApiUrlHelper.defaultBaseUrl.length - 1,
              )
            : ApiUrlHelper.defaultBaseUrl;

        expect(factory.baseUrl, normalizedDefault);
        expect(logRecords, isNotEmpty);
        expect(
          logRecords.any(
            (record) =>
                record.level == Level.WARNING &&
                record.message.contains(
                  'Failed to retrieve baseUrl from '
                  'ApiNetworkInvoker using GetIt',
                ),
          ),
          isTrue,
        );

        await subscription.cancel();
      },
    );

    test('Uses testBaseUrl when provided and normalizes trailing slash', () {
      ImageUrlFactory.testBaseUrl = 'https://custom-api.example.com/';
      const factory = MenuItemImageUrlFactory('img123');

      expect(factory.baseUrl, 'https://custom-api.example.com');
    });

    test('Uses testBaseUrl when provided without trailing slash', () {
      ImageUrlFactory.testBaseUrl = 'https://custom-api.example.com';
      const factory = MenuItemImageUrlFactory('img123');

      expect(factory.baseUrl, 'https://custom-api.example.com');
    });

    group('MenuItemImageUrlFactory URL generation', () {
      setUp(() {
        ImageUrlFactory.testBaseUrl = 'https://api.test.com';
      });

      test('Generates correct URLs for all sizes', () {
        const factory = MenuItemImageUrlFactory('item456');

        expect(
          factory.urlOriginal,
          'https://api.test.com/sale/public/images/item456?size=original',
        );
        expect(
          factory.urlSmall,
          'https://api.test.com/sale/public/images/item456?size=small',
        );
        expect(
          factory.urlMedium,
          'https://api.test.com/sale/public/images/item456?size=medium',
        );
        expect(
          factory.urlLarge,
          'https://api.test.com/sale/public/images/item456?size=large',
        );
      });

      test('url() selector method returns correct URL for each ImageSize', () {
        const factory = MenuItemImageUrlFactory('item456');

        expect(factory.url(ImageSize.original), factory.urlOriginal);
        expect(factory.url(ImageSize.small), factory.urlSmall);
        expect(factory.url(ImageSize.medium), factory.urlMedium);
        expect(factory.url(ImageSize.large), factory.urlLarge);
      });
    });

    group('ShopImageUrlFactory URL generation', () {
      setUp(() {
        ImageUrlFactory.testBaseUrl = 'https://api.test.com';
      });

      test('Generates correct URLs for all sizes', () {
        const factory = ShopImageUrlFactory('shop789');

        expect(
          factory.urlOriginal,
          'https://api.test.com/sale/shops/shop789/image?size=original',
        );
        expect(
          factory.urlSmall,
          'https://api.test.com/sale/shops/shop789/image?size=small',
        );
        expect(
          factory.urlMedium,
          'https://api.test.com/sale/shops/shop789/image?size=medium',
        );
        expect(
          factory.urlLarge,
          'https://api.test.com/sale/shops/shop789/image?size=large',
        );
      });

      test('url() selector method returns correct URL for each ImageSize', () {
        const factory = ShopImageUrlFactory('shop789');

        expect(factory.url(ImageSize.original), factory.urlOriginal);
        expect(factory.url(ImageSize.small), factory.urlSmall);
        expect(factory.url(ImageSize.medium), factory.urlMedium);
        expect(factory.url(ImageSize.large), factory.urlLarge);
      });
    });
  });
}
