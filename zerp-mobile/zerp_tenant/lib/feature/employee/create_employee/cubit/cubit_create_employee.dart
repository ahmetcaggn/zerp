import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_employee/api.dart';
import 'package:zerp_tenant/product/service/employee/employee_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@injectable
class CubitCreateEmployee extends Cubit<StateCreateEmployee> {
  CubitCreateEmployee(this._employeeService)
    : super(const StateCreateEmployeeInitial());

  final EmployeeService _employeeService;

  Future<void> createEmployee(CreateEmployeeRequestDto dto) async {
    emit(const StateCreateEmployeeLoading());
    try {
      await _employeeService.createEmployee(createEmployeeRequest: dto);
      emit(const StateCreateEmployeeSucceed());
    } on NetworkErrorBase catch (e) {
      if (e is NetworkErrorInvalidResponseType) {
        if (e.statusCode == 200 || e.statusCode == 201) {
          emit(const StateCreateEmployeeSucceed());
        } else {
          emit(
            StateCreateEmployeeError(
              t.common.error(message: '${e.statusCode} ${e.message}'),
            ),
          );
        }
      }
    } on Object catch (e) {
      emit(StateCreateEmployeeError(t.common.error(message: e.toString())));
    }
  }
}

sealed class StateCreateEmployee {
  const StateCreateEmployee();
}

final class StateCreateEmployeeInitial extends StateCreateEmployee {
  const StateCreateEmployeeInitial();
}

final class StateCreateEmployeeLoading extends StateCreateEmployee {
  const StateCreateEmployeeLoading();
}

final class StateCreateEmployeeSucceed extends StateCreateEmployee {
  const StateCreateEmployeeSucceed();
}

final class StateCreateEmployeeError extends StateCreateEmployee {
  const StateCreateEmployeeError(this.message);

  final String message;
}
