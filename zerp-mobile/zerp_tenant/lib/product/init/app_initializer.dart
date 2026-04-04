import 'package:get_it/get_it.dart';
import 'package:zerp_tenant/product/network/network_manager.dart';
import 'package:zerp_tenant/product/storage/storage_initializer.dart';

abstract final class AppInitializer {
  const AppInitializer._();

  static GetIt g = GetIt.instance;

  static Future<void> initialize() async {
    await StorageInitializer.initialize();
    _initNetworkManager();
  }

  static void _initNetworkManager() {
    g.registerSingleton<NetworkManager>(NetworkManager());
  }
}
