import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/network/api_url_helper.dart';
import 'package:zerp_tenant/product/network/network_invoker/api_network_invoker.dart';
import 'package:zerp_tenant/product/storage/model/settings.storage_model.dart';
import 'package:zerp_tenant/product/storage/operator/settings.operator.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@lazySingleton
final class CubitSettings extends Cubit<StateSettings> {
  CubitSettings(
    this._settingsOperator,
    this._apiNetworkInvoker,
  ) : super(const StateSettingsInitial());

  final SettingsOperator _settingsOperator;
  final ApiNetworkInvoker _apiNetworkInvoker;

  Future<void> init() async {
    final data = await _getSavedSettingsOrDefault();
    _apiNetworkInvoker.updateBaseUrl(
      data.apiHost ?? ApiUrlHelper.defaultBaseUrl,
    );
    if (data.remoteLogLevel != null) {
      final savedLevel = _parseLogLevel(data.remoteLogLevel!);
      try {
        final remoteLogging = getIt<RemoteLogging>();
        remoteLogging.config =
            remoteLogging.config.copyWith(logSendLevel: savedLevel);
      } on Object catch (_) {
        // RemoteLogging instance might not be initialized yet (will be
        // initialized right after settings in AppInitializer)
      }
    }
    if (data.language != null && data.language != 'system') {
      await LocaleSettings.setLocaleRaw(data.language!);
    } else {
      await LocaleSettings.useDeviceLocale();
    }
    _emitSettings(data);
  }

  Future<void> updateApiHost(String newApiHost) async {
    final trimmedHost = newApiHost.trim();
    final currentData = await _getSavedSettingsOrDefault();

    // save to Sembast storage
    final saved = await _settingsOperator.put(
      currentData.copyWith(apiHost: trimmedHost),
    );
    _apiNetworkInvoker.updateBaseUrl(trimmedHost);
    _emitSettings(saved);
  }

  Future<void> updateRemoteLogLevel(String levelName) async {
    final currentData = await _getSavedSettingsOrDefault();
    final saved = await _settingsOperator.put(
      currentData.copyWith(remoteLogLevel: levelName),
    );
    final level = _parseLogLevel(levelName);
    try {
      final remoteLogging = getIt<RemoteLogging>();
      remoteLogging.config =
          remoteLogging.config.copyWith(logSendLevel: level);
    } on Object catch (_) {
      // Ignore if RemoteLogging is not initialized yet
    }
    _emitSettings(saved);
  }

  Future<void> updateLanguage(String languageCode) async {
    final currentData = await _getSavedSettingsOrDefault();
    final saved = await _settingsOperator.put(
      currentData.copyWith(language: languageCode),
    );
    if (languageCode == 'system') {
      await LocaleSettings.useDeviceLocale();
    } else {
      await LocaleSettings.setLocaleRaw(languageCode);
    }
    _emitSettings(saved);
  }

  Level _parseLogLevel(String name) {
    return Level.LEVELS.firstWhere(
      (l) => l.name == name,
      orElse: () => Level.CONFIG,
    );
  }

  void _emitSettings(SettingsStorageModel data) {
    emit(
      StateSettingsLoaded(
        currentApiHost: data.apiHost,
        currentRemoteLogLevel: data.remoteLogLevel ?? 'CONFIG',
        currentLanguage: data.language ?? 'system',
      ),
    );
  }

  Future<SettingsStorageModel> _getSavedSettingsOrDefault() async {
    final savedSettings = await _settingsOperator.get();
    if (savedSettings == null) {
      return _settingsOperator.put(
        SettingsStorageModel(apiHost: ApiUrlHelper.defaultBaseUrl),
      );
    } else {
      return savedSettings;
    }
  }
}

sealed class StateSettings {
  const StateSettings();
}

final class StateSettingsInitial extends StateSettings {
  const StateSettingsInitial();
}

final class StateSettingsLoaded extends StateSettings {
  const StateSettingsLoaded({
    this.currentApiHost,
    this.currentRemoteLogLevel,
    this.currentLanguage,
  });

  final String? currentApiHost;
  final String? currentRemoteLogLevel;
  final String? currentLanguage;

  StateSettingsLoaded copyWith({
    String? currentApiHost,
    String? currentRemoteLogLevel,
    String? currentLanguage,
  }) {
    return StateSettingsLoaded(
      currentApiHost: currentApiHost ?? this.currentApiHost,
      currentRemoteLogLevel:
          currentRemoteLogLevel ?? this.currentRemoteLogLevel,
      currentLanguage: currentLanguage ?? this.currentLanguage,
    );
  }
}
