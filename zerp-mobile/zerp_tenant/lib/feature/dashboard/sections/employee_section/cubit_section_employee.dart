import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_employee/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/employee/employee_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@lazySingleton
class CubitSectionEmployee extends Cubit<StateSectionEmployee>
    with LoggerMixin<CubitSectionEmployee> {
  CubitSectionEmployee(this._employeeService)
    : super(const StateSectionEmployeeInitial());

  final EmployeeService _employeeService;

  Future<void> load() async {
    try {
      emit(const StateSectionEmployeeLoading());
      final results = await Future.wait([
        _employeeService.getEmployees(
          pageRequest: const PageRequest(start: 0, end: 1),
        ),
        _employeeService.getEmployees(
          pageRequest: const PageRequest(start: 0, end: 1),
          queryParams: {
            'status.eq': EmployeeListResponseDtoStatusEnum.ACTIVE.value,
          },
        ),
      ]);
      final all = results[0];
      final actives = results[1];
      emit(
        StateSectionEmployeeLoaded(
          totalCount: all.totalCount,
          activeCount: actives.totalCount,
        ),
      );
    } on Object catch (e, s) {
      log.severe('Error loading employee data', e, s);
      emit(
        StateSectionEmployeeError(
          message: t.dashboard.employeeSection.errorLoading,
        ),
      );
    }
  }
}

sealed class StateSectionEmployee {
  const StateSectionEmployee();
}

final class StateSectionEmployeeInitial extends StateSectionEmployee {
  const StateSectionEmployeeInitial();
}

final class StateSectionEmployeeLoading extends StateSectionEmployee {
  const StateSectionEmployeeLoading();
}

final class StateSectionEmployeeLoaded extends StateSectionEmployee {
  const StateSectionEmployeeLoaded({
    required this.totalCount,
    required this.activeCount,
  });

  final int totalCount;
  final int activeCount;
}

final class StateSectionEmployeeError extends StateSectionEmployee {
  const StateSectionEmployeeError({required this.message});

  final String message;
}
