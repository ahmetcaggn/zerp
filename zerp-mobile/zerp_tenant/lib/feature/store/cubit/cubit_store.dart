import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/store/cubit/state_store.dart';

class CubitStore extends Cubit<StateStore> {
  CubitStore() : super(const StateStore());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
