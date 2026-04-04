import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/login/cubit/state_login.dart';

class CubitLogin extends Cubit<StateLogin> {
  CubitLogin() : super(const StateLogin());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
