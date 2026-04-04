import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/sale/cubit/state_sale.dart';

class CubitSale extends Cubit<StateSale> {
  CubitSale() : super(const StateSale());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
