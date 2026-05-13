import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/employee/cubit/state_employee.dart';
import 'package:zerp_tenant/product/service/employee/employee_service.dart';

@injectable
class CubitEmployee extends Cubit<StateEmployee>
    with LoggerMixin<CubitEmployee> {
  CubitEmployee(this._employeeService) : super(const StateEmployeeInitial());

  final EmployeeService _employeeService;

  Future<void> loadEmployees() async {
    emit(const StateEmployeeLoading());
    try {
      final employees = await _employeeService.getEmployees();
      emit(StateEmployeeLoaded(data: employees));
    } on Object catch (e) {
      emit(StateEmployeeError(message: 'Failed to load employees: $e'));
    }
  }
}
