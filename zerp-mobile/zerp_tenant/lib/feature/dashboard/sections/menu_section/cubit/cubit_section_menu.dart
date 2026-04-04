import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/dashboard/sections/menu_section/cubit/state_section_menu.dart';

class CubitSectionMenu extends Cubit<StateSectionMenu> {
  CubitSectionMenu() : super(const StateSectionMenu());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
