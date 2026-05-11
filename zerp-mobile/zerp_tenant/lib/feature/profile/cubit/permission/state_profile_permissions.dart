import 'package:openapi_user/api.dart';

sealed class StateProfilePermissions {
  const StateProfilePermissions();
}

final class StateProfilePermissionsInitial extends StateProfilePermissions {
  const StateProfilePermissionsInitial();
}

final class StateProfilePermissionsLoading extends StateProfilePermissions {
  const StateProfilePermissionsLoading();
}

final class StateProfilePermissionsLoaded extends StateProfilePermissions {
  const StateProfilePermissionsLoaded({required this.permissions});

  final List<PermissionResponse> permissions;
}

final class StateProfilePermissionsError extends StateProfilePermissions {
  const StateProfilePermissionsError({required this.message});

  final String message;
}
