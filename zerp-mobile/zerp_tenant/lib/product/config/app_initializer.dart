import 'dart:async';

import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/config/device_id_generator.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/network/network_manager.dart';
import 'package:zerp_tenant/product/storage/storage_initializer.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

abstract final class AppInitializer {
  const AppInitializer._();

  static Future<void> initialize() async {
    // dependency injection
    configureDependencies();

    // storage
    await StorageInitializer.initialize();

    // localization
    LocaleSettings.useDeviceLocaleSync();

    // logging
    final loggerHelper = await RemoteLogging.init(
      remoteLoggingConfig: const RemoteLoggingConfig(
        // ignore: avoid_redundant_argument_values readability
        enableRemoteLogging: true,
        loggerEndpointDevice: '/api/v1/device',
        loggerEndpointLog: '/api/v1/log',
        loggerEndpointLogBatch: '/api/v1/log/batch',
        logSendLevel: Level.CONFIG,
        logPrintLevel: Level.FINE,
        localLogPrintLevel: Level.FINE,
      ),
      deviceDataGenerator: getIt<DeviceIdGenerator>(),
    );
    unawaited(loggerHelper.start(getIt<NetworkManager>().remoteLogInvoker));

    // remote auth check at startup (guard remains local-fast)
    unawaited(getIt<CubitAuth>().checkAuthRemote());

    logger('AppInitializer').config(() => 'App initialization complete');
  }
}
