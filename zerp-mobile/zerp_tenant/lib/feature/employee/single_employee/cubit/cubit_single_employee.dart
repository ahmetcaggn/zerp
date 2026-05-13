import 'package:injectable/injectable.dart';
import 'package:openapi_employee/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/employee/employee_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';
import 'package:zerp_tenant/product/util/employee_response_extensions.dart';

@injectable
final class CubitSingleEmployee extends BaseCubit<StateSingleEmployee>
    with LoggerMixin<CubitSingleEmployee> {
  CubitSingleEmployee(this._employeeService)
    : super(const StateSingleEmployeeInitial());

  final EmployeeService _employeeService;

  Future<void> loadEmployee(String employeeId) async {
    log.fine('Loading employee with ID: $employeeId');
    emit(const StateSingleEmployeeLoading());
    try {
      final employee = await _employeeService.getEmployeeById(employeeId);
      log.fine('Loaded employee: ${employee.fullName} (ID: ${employee.id})');
      emit(StateSingleEmployeeLoaded(employee));
    } on Object catch (e, s) {
      log.severe('Error loading employee: $e', e, s);
      emit(StateSingleEmployeeError(t.common.error(message: e.toString())));
    }
  }
}

sealed class StateSingleEmployee {
  const StateSingleEmployee();
}

final class StateSingleEmployeeInitial extends StateSingleEmployee {
  const StateSingleEmployeeInitial();
}

final class StateSingleEmployeeLoading extends StateSingleEmployee {
  const StateSingleEmployeeLoading();
}

final class StateSingleEmployeeLoaded extends StateSingleEmployee {
  const StateSingleEmployeeLoaded(this.data);

  final EmployeeResponseDto data;
}

final class StateSingleEmployeeError extends StateSingleEmployee {
  const StateSingleEmployeeError(this.message);

  final String message;
}
