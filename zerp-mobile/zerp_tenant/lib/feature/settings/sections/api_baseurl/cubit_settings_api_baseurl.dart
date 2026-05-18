import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/settings/cubit_settings.dart';
import 'package:zerp_tenant/product/network/api_url_helper.dart';
import 'package:zerp_tenant/product/service/api_status/api_status_service.dart';
import 'package:zerp_tenant/product/service/api_status/model/actuator_status.dart';

@injectable
class CubitSettingsApiBaseUrl extends Cubit<StateSettingsApiBaseUrl>
    with LoggerMixin<CubitSettingsApiBaseUrl> {
  CubitSettingsApiBaseUrl(
    this._cubitSettings,
    this._apiStatusService,
  ) : super(const StateSettingsApiBaseUrl()) {
    unawaited(_init());
  }

  final CubitSettings _cubitSettings;
  final ApiStatusService _apiStatusService;

  Future<void> _init() async {
    try {
      emit(state.copyWith(isLoading: true, isCheckingApiStatus: true));

      final globalState = _cubitSettings.state;
      final currentHost = globalState is StateSettingsLoaded
          ? globalState.currentApiHost
          : ApiUrlHelper.defaultBaseUrl;

      // Check status on the loaded base URL
      final status = await _apiStatusService.checkApiStatus();

      emit(
        state.copyWith(
          isLoading: false,
          isCheckingApiStatus: false,
          currentApiHost: currentHost,
          predefinedUrls: ApiUrlHelper.allBaseUrls,
          apiStatus: status,
        ),
      );
    } on Object catch (e, s) {
      log.severe('Failed to initialize API base URL settings: $e', e, s);
      emit(
        state.copyWith(
          isLoading: false,
          isCheckingApiStatus: false,
          apiStatus: ActuatorStatus.unknown,
        ),
      );
    }
  }

  Future<void> saveSettings(String newApiHost) async {
    emit(state.copyWith(isLoading: true, isCheckingApiStatus: true));
    final trimmedHost = newApiHost.trim();
    await _cubitSettings.updateApiHost(trimmedHost);
    final status = await _apiStatusService.checkApiStatus();
    emit(
      state.copyWith(
        isLoading: false,
        isCheckingApiStatus: false,
        currentApiHost: trimmedHost,
        apiStatus: status,
      ),
    );
  }
}

class StateSettingsApiBaseUrl extends Equatable {
  const StateSettingsApiBaseUrl({
    this.isLoading = false,
    this.currentApiHost = '',
    this.predefinedUrls = const [],
    this.apiStatus = ActuatorStatus.unknown,
    this.isCheckingApiStatus = false,
  });

  final bool isLoading;
  final String currentApiHost;
  final List<String> predefinedUrls;
  final ActuatorStatus apiStatus;
  final bool isCheckingApiStatus;

  StateSettingsApiBaseUrl copyWith({
    bool? isLoading,
    String? currentApiHost,
    List<String>? predefinedUrls,
    ActuatorStatus? apiStatus,
    bool? isCheckingApiStatus,
  }) {
    return StateSettingsApiBaseUrl(
      isLoading: isLoading ?? this.isLoading,
      currentApiHost: currentApiHost ?? this.currentApiHost,
      predefinedUrls: predefinedUrls ?? this.predefinedUrls,
      apiStatus: apiStatus ?? this.apiStatus,
      isCheckingApiStatus: isCheckingApiStatus ?? this.isCheckingApiStatus,
    );
  }

  @override
  List<Object?> get props => [
    isLoading,
    currentApiHost,
    predefinedUrls,
    apiStatus,
    isCheckingApiStatus,
  ];
}
