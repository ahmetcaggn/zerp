import 'dart:async';

import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/user/username_service.dart';

@injectable
final class CubitCreateEmployeeUsername
    extends BaseCubit<StateCreateEmployeeUsername>
    with LoggerMixin<CubitCreateEmployeeUsername> {
  CubitCreateEmployeeUsername(this._usernameService)
    : super(const StateCreateEmployeeUsernameInitial());

  final UsernameService _usernameService;

  static const Duration _debounceDuration = Duration(milliseconds: 1000);
  Timer _debounceTimer = Timer(_debounceDuration, () {});

  CheckUsernameCommand? _request;

  void onChanged(String value) {
    emit(const StateCreateEmployeeUsernameInitial());
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
        const StateCreateEmployeeUsernameError(
          'Username cannot contain spaces.',
        ),
      );
      return;
    }

    emit(const StateCreateEmployeeUsernameLoading());
    try {
      _request = CheckUsernameCommand(username: username);
      final isAvailable = await _usernameService.isUsernameAvailable(_request!);
      if (isAvailable) {
        emit(const StateCreateEmployeeUsernameAvailable());
      } else {
        emit(const StateCreateEmployeeUsernameTaken());
      }
    } on RequestCancelledError catch (_) {
    } on Object catch (e) {
      log.severe('Error checking username availability $e', e);
      emit(StateCreateEmployeeUsernameError('Error checking username: $e'));
    }
  }
}

sealed class StateCreateEmployeeUsername {
  const StateCreateEmployeeUsername();
}

final class StateCreateEmployeeUsernameInitial
    extends StateCreateEmployeeUsername {
  const StateCreateEmployeeUsernameInitial();
}

final class StateCreateEmployeeUsernameLoading
    extends StateCreateEmployeeUsername {
  const StateCreateEmployeeUsernameLoading();
}

final class StateCreateEmployeeUsernameAvailable
    extends StateCreateEmployeeUsername {
  const StateCreateEmployeeUsernameAvailable();
}

final class StateCreateEmployeeUsernameTaken
    extends StateCreateEmployeeUsername {
  const StateCreateEmployeeUsernameTaken();
}

final class StateCreateEmployeeUsernameError
    extends StateCreateEmployeeUsername {
  const StateCreateEmployeeUsernameError(this.message);

  final String message;
}
