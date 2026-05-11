import 'dart:io';

import 'package:device_info_plus/device_info_plus.dart';
import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:uuid/uuid.dart';
import 'package:zerp_tenant/product/storage/model/device_id.storage_model.dart';
import 'package:zerp_tenant/product/storage/operator/device_id.operator.dart';

/// Generates and manages device and session identifiers for logging.
///
/// This class handles:
/// - Device ID: Persisted securely using platform-specific secure storage
/// - Session ID: Generated fresh on each app launch
/// - Device Metadata: OS, model, manufacturer, etc.
@lazySingleton
final class DeviceIdGenerator implements IDeviceDataGenerator {
  DeviceIdGenerator(this._deviceIdOperator);

  final DeviceIdOperator _deviceIdOperator;

  late final String _deviceId;
  late final String _sessionId;
  late DeviceMetadata _deviceMetadata;

  @override
  Future<void> init() async {
    await _generateDeviceId();
    _generateSessionId();
    _deviceMetadata = await _DeviceMetadataCollector.collect(
      _deviceId,
      _sessionId,
    );
  }

  @override
  String get deviceId => _deviceId;

  @override
  String get sessionId => _sessionId;

  @override
  DeviceMetadata get deviceMetadata => _deviceMetadata;

  Future<void> _generateDeviceId() async {
    final readData = await _deviceIdOperator.get();
    if (readData != null) {
      _deviceId = readData.deviceId;
    } else {
      final idToSave = const Uuid().v4();
      final savedData = await _deviceIdOperator.put(
        DeviceIdStorageModel(deviceId: idToSave),
      );
      _deviceId = savedData.deviceId;
    }
  }

  void _generateSessionId() {
    _sessionId = const Uuid().v4();
  }
}

/// An helper class to collect device metadata such as OS, model, and
/// manufacturer.
abstract final class _DeviceMetadataCollector {
  /// Retrieves device metadata.
  static Future<DeviceMetadata> collect(
    String deviceId,
    String sessionId,
  ) async {
    final deviceInfo = DeviceInfoPlugin();
    final timestamp = DateTime.now().toUtc().toIso8601String();

    if (Platform.isAndroid) {
      final info = await deviceInfo.androidInfo;
      return DeviceMetadata(
        timestamp: timestamp,
        deviceId: deviceId,
        sessionId: sessionId,
        os: 'Android',
        osVersion: info.version.release,
        model: info.model,
        brand: info.brand,
        device: info.device,
        identifier: info.id,
        manufacturer: info.manufacturer,
        isPhysicalDevice: info.isPhysicalDevice.toString(),
      );
    } else if (Platform.isIOS) {
      final info = await deviceInfo.iosInfo;
      return DeviceMetadata(
        timestamp: timestamp,
        deviceId: deviceId,
        sessionId: sessionId,
        os: 'iOS',
        osVersion: info.systemVersion,
        model: info.utsname.machine,
        brand: 'Apple',
        device: info.name,
        identifier: info.identifierForVendor ?? 'unknown',
        manufacturer: 'Apple',
        isPhysicalDevice: info.isPhysicalDevice.toString(),
      );
    } else {
      return DeviceMetadata(
        timestamp: timestamp,
        deviceId: deviceId,
        sessionId: sessionId,
        os: 'Unknown',
        osVersion: 'unknown',
        model: 'unknown',
        brand: 'unknown',
        device: 'unknown',
        identifier: 'unknown',
        manufacturer: 'unknown',
        isPhysicalDevice: 'unknown',
      );
    }
  }
}
