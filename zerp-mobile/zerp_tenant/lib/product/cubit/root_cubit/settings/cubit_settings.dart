import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:zerp_tenant/product/network/api_url_helper.dart';
import 'package:zerp_tenant/product/network/network_invoker/api_network_invoker.dart';
import 'package:zerp_tenant/product/storage/model/settings.storage_model.dart';
import 'package:zerp_tenant/product/storage/operator/settings.operator.dart';

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
    _emitSettings(data);
  }

  Future<void> updateApiHost(String newApiHost) async {
    final trimmedHost = newApiHost.trim();

    // save to Sembast storage
    final saved = await _settingsOperator.put(
      SettingsStorageModel(apiHost: trimmedHost),
    );
    _apiNetworkInvoker.updateBaseUrl(trimmedHost);
    _emitSettings(saved);
  }

  void _emitSettings(SettingsStorageModel data) {
    emit(
      StateSettingsLoaded(
        currentApiHost: data.apiHost,
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
  });

  final String? currentApiHost;

  StateSettingsLoaded copyWith({
    String? currentApiHost,
  }) {
    return StateSettingsLoaded(
      currentApiHost: currentApiHost ?? this.currentApiHost,
    );
  }
}
