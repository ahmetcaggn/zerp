import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/employee/cubit/state_employee.dart';

class CubitEmployee extends Cubit<StateEmployee> {
  CubitEmployee() : super(const StateEmployee());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
