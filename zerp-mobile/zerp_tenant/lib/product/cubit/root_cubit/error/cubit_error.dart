import 'dart:async';

import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/error_to_present.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/state_error.dart';
import 'package:zerp_tenant/product/util/string_extension.dart';

@lazySingleton
class CubitError extends BaseCubit<StateError> with LoggerMixin<CubitError> {
  CubitError() : super(const StateError([]));

  final List<ErrorToPresent> _queue = [];

  void enqueue(ErrorToPresent error) {
    log.info(
      'Enqueueing error: ${error.message.firstCharsSafe(64)} '
      'for ${error.duration.inSeconds} seconds',
    );
    _queue.add(error);
    emit(StateError(List.from(toMessages)));
    Timer(error.duration, () => _removeError(error));
  }

  void _removeError(ErrorToPresent error) {
    log.info('Removing error: ${error.message}');
    _queue.remove(error);
    emit(StateError(List.from(toMessages)));
  }

  List<String> get toMessages {
    return _queue.map((e) => e.message).toList();
  }
}
