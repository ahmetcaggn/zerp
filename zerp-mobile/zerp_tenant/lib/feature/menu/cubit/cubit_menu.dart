import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/menu/cubit/state_menu.dart';

class CubitMenu extends Cubit<StateMenu> {
  CubitMenu() : super(const StateMenu());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
