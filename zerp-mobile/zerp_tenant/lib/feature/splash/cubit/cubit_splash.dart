import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/splash/cubit/state_splash.dart';

class CubitSplash extends Cubit<StateSplash> {
  CubitSplash() : super(const StateSplash());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
