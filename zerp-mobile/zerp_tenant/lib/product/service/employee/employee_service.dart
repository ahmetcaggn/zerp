import 'package:injectable/injectable.dart';
import 'package:openapi_employee/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/cubit_error.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/service_base.dart';
import 'package:zerp_tenant/product/util/network_result_extension.dart';

@lazySingleton
class EmployeeService extends ServiceBase with LoggerMixin<EmployeeService> {
  EmployeeService({
    required super.invoker,
    required super.authStorageService,
    required super.cubitError,
    required super.cubitAuth,
  });

  Future<PageResponse<EmployeeListResponseDto>> getEmployees({
    PageRequest pageRequest = PageRequest.all,
    Map<String, String> queryParams = const {},
  }) async {
    final request = GetListEmployeesCommand(
      start: pageRequest.start,
      end: pageRequest.end,
      allParams: queryParams,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseListEmployeeListResponseDto>():
        final employees = res.data.data;
        final totalCount = res.totalCountHeader;
        if (totalCount == null) {
          log.severe('Total count header is missing in the response');
          cubitError.enqueue(
            const ErrorToPresent(
              message: 'Total count of employees is missing in the response',
            ),
          );
        }

        log.info(
          'Fetched ${employees.length} employees. '
          '(total count: $totalCount)',
        );
        return PageResponse(
          req: pageRequest,
          items: employees,
          totalCount: totalCount,
        );

      case NetworkErrorResult<ApiResponseListEmployeeListResponseDto>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseListEmployeeListResponseDto>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<EmployeeResponseDto> getEmployeeById(String employeeId) async {
    final request = GetOneEmployeeCommand(id: employeeId);

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseEmployeeResponseDto>():
        final employee = res.data.data;
        if (employee == null) {
          log.warning('Employee with ID $employeeId not found in response');
          cubitError.enqueue(
            ErrorToPresent(message: 'Employee with ID $employeeId not found'),
          );
          throw Exception('Employee with ID $employeeId not found');
        }
        log.info('Fetched employee with ID $employeeId');
        return employee;

      case NetworkErrorResult<ApiResponseEmployeeResponseDto>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseEmployeeResponseDto>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<ApiResponseEmployeeResponseDto> createEmployee({
    required CreateEmployeeRequestDto createEmployeeRequest,
  }) async {
    final request = CreateEmployeeCommand(
      createEmployeeRequestDto: createEmployeeRequest,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseEmployeeResponseDto>():
        log.info('Successfully created employee: ${res.data.data?.id}');
        return res.data;

      case NetworkErrorResult<ApiResponseEmployeeResponseDto>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseEmployeeResponseDto>():
        throw onUnsuccessfulResponse(res);
    }
  }

  Future<ApiResponseEmployeeResponseDto> updateEmployee({
    required String id,
    required UpdateEmployeeRequestDto updateEmployeeRequest,
  }) async {
    final request = UpdateEmployeeCommand(
      id: id,
      updateEmployeeRequestDto: updateEmployeeRequest,
    );

    final res = await invoker.send(request);
    switch (res) {
      case SuccessResponseResult<ApiResponseEmployeeResponseDto>():
        log.info('Successfully updated employee: ${res.data.data?.id}');
        return res.data;

      case NetworkErrorResult<ApiResponseEmployeeResponseDto>():
        throw onNetworkError(res);
      case SpecifiedResponseResult<ApiResponseEmployeeResponseDto>():
        throw onUnsuccessfulResponse(res);
    }
  }
}
