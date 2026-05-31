import 'dart:async';

import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/user/username_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@injectable
final class CubitEmployeeUsername extends BaseCubit<StateEmployeeUsername>
    with LoggerMixin<CubitEmployeeUsername> {
  CubitEmployeeUsername(this._usernameService)
    : super(const StateEmployeeUsernameInitial());

  final UsernameService _usernameService;

  static const Duration _debounceDuration = Duration(milliseconds: 1000);
  Timer _debounceTimer = Timer(_debounceDuration, () {});

  CheckUsernameCommand? _request;

  void onChanged(String value) {
    emit(const StateEmployeeUsernameInitial());
    final request = _request;
    if (request != null) {
      if (request.result == null) {
        log.fine(
          'Previous username check for "${request.username}" completed, '
          'starting new check for "$value".',
        );
        request.cancel();
      }
      _request = null;
    }
    _debounceTimer.cancel();
    _debounceTimer = Timer(_debounceDuration, () async {
      await checkUsernameAvailable(value);
    });
  }

  Future<void> checkUsernameAvailable(String username) async {
    if (username.contains(' ')) {
      emit(
        StateEmployeeUsernameError(
          t.employee.usernameField.errorContainsSpaces,
        ),
      );
      return;
    }

    emit(const StateEmployeeUsernameLoading());
    try {
      _request = CheckUsernameCommand(username: username);
      final isAvailable = await _usernameService.isUsernameAvailable(_request!);
      if (isAvailable) {
        emit(const StateEmployeeUsernameAvailable());
      } else {
        emit(const StateEmployeeUsernameTaken());
      }
    } on RequestCancelledError catch (_) {
    } on Object catch (e) {
      log.severe('Error checking username availability $e', e);
      emit(StateEmployeeUsernameError('Error checking username: $e'));
    }
  }
}

sealed class StateEmployeeUsername {
  const StateEmployeeUsername();
}

final class StateEmployeeUsernameInitial extends StateEmployeeUsername {
  const StateEmployeeUsernameInitial();
}

final class StateEmployeeUsernameLoading extends StateEmployeeUsername {
  const StateEmployeeUsernameLoading();
}

final class StateEmployeeUsernameAvailable extends StateEmployeeUsername {
  const StateEmployeeUsernameAvailable();
}

final class StateEmployeeUsernameTaken extends StateEmployeeUsername {
  const StateEmployeeUsernameTaken();
}

final class StateEmployeeUsernameError extends StateEmployeeUsername {
  const StateEmployeeUsernameError(this.message);

  final String message;
}
