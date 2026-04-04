import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/stock/cubit/state_stock.dart';

class CubitStock extends Cubit<StateStock> {
  CubitStock() : super(const StateStock());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
