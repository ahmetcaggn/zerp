import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:remote_logging/remote_logging.dart';

abstract class BaseCubit<T> extends Cubit<T> {
  BaseCubit(super.initialState);

  late final Logger _log = logger('BaseCubit');

  @override
  void emit(T state) {
    _log.fine('Emitting new state: $state');
    super.emit(state);
  }
}
