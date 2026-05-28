import 'dart:async';

import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/config/device_id_generator.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/settings/cubit_settings.dart';
import 'package:zerp_tenant/product/network/network_invoker/remote_log_network_invoker.dart';
import 'package:zerp_tenant/product/storage/storage_initializer.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

abstract final class AppInitializer {
  const AppInitializer._();

  static Future<void> initialize() async {
    // storage
    await StorageInitializer.initialize();

    // dependency injection
    configureDependencies();

    // load base URL settings from storage
    await getIt<CubitSettings>().init();
    unawaited(getIt<CubitOrganizationScope>().loadTenant());

    // localization
    await LocaleSettings.useDeviceLocale();

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
    unawaited(loggerHelper.start(getIt<RemoteLogNetworkInvoker>()));

    logger('AppInitializer').config(() => 'App initialization complete');
  }
}
