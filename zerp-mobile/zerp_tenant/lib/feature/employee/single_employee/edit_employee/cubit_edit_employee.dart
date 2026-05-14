import 'dart:async';

import 'package:injectable/injectable.dart';
import 'package:openapi_employee/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_single_employee.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/employee/employee_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@injectable
final class CubitEditEmployee extends BaseCubit<StateEditEmployee>
    with LoggerMixin<CubitEditEmployee> {
  CubitEditEmployee(
    this._employeeService,
    @factoryParam this.cubitSingleEmployee,
  ) : super(const StateEditEmployeeInitial());

  final EmployeeService _employeeService;
  final CubitSingleEmployee cubitSingleEmployee;

  Future<void> updateEmployee(
    String id,
    UpdateEmployeeRequestDto request,
  ) async {
    emit(const StateEditEmployeeLoading());
    try {
      await _employeeService.updateEmployee(
        id: id,
        updateEmployeeRequest: request,
      );
      emit(const StateEditEmployeeSuccess());
      unawaited(cubitSingleEmployee.loadEmployee(id));
    } on Object catch (e, s) {
      log.severe('Failed to update employee: $e', e, s);
      emit(StateEditEmployeeError(t.common.error(message: e.toString())));
    }
  }
}

sealed class StateEditEmployee {
  const StateEditEmployee();
}

final class StateEditEmployeeInitial extends StateEditEmployee {
  const StateEditEmployeeInitial();
}

final class StateEditEmployeeLoading extends StateEditEmployee {
  const StateEditEmployeeLoading();
}

final class StateEditEmployeeSuccess extends StateEditEmployee {
  const StateEditEmployeeSuccess();
}

final class StateEditEmployeeError extends StateEditEmployee {
  const StateEditEmployeeError(this.message);

  final String message;
}
