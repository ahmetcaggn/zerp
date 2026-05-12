import 'package:openapi_user/api.dart';

sealed class StatePermissionView {
  const StatePermissionView();
}

final class StatePermissionViewInitial extends StatePermissionView {
  const StatePermissionViewInitial();
}

final class StatePermissionViewLoading extends StatePermissionView {
  const StatePermissionViewLoading();
}

final class StatePermissionViewLoaded extends StatePermissionView {
  const StatePermissionViewLoaded({
    required this.permissions,
    required this.totalCount,
  });

  final List<PermissionResponse> permissions;
  final int totalCount;
}

final class StatePermissionViewError extends StatePermissionView {
  const StatePermissionViewError({required this.message});

  final String message;
}
