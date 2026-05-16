import 'package:openapi_employee/api.dart';
import 'package:zerp_tenant/product/network/page_response.dart';

sealed class StateEmployee {
  const StateEmployee();
}

final class StateEmployeeInitial extends StateEmployee {
  const StateEmployeeInitial();
}

final class StateEmployeeLoading extends StateEmployee {
  const StateEmployeeLoading();
}

final class StateEmployeeLoaded extends StateEmployee {
  const StateEmployeeLoaded({
    required this.data,
  });

  final PageResponse<EmployeeListResponseDto> data;
}

final class StateEmployeeError extends StateEmployee {
  const StateEmployeeError({required this.message});

  final String message;
}
