import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/settings/cubit/state_settings.dart';

class CubitSettings extends Cubit<StateSettings> {
  CubitSettings() : super(const StateSettings());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
