import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/dashboard/sections/stock_section/cubit/state_section_stock.dart';

class CubitSectionStock extends Cubit<StateSectionStock> {
  CubitSectionStock() : super(const StateSectionStock());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
