import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/dashboard/sections/employee_section/cubit/state_section_employee.dart';

class CubitSectionEmployee extends Cubit<StateSectionEmployee> {
  CubitSectionEmployee() : super(const StateSectionEmployee());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
