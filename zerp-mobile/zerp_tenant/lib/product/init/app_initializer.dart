import 'package:zerp_tenant/product/init/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/storage/storage_initializer.dart';

abstract final class AppInitializer {
  const AppInitializer._();

  static Future<void> initialize() async {
    await StorageInitializer.initialize();
    configureDependencies();
  }
}
