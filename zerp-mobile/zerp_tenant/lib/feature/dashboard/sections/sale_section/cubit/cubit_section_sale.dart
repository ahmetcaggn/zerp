import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/dashboard/sections/sale_section/cubit/state_section_sale.dart';

class CubitSectionSale extends Cubit<StateSectionSale> {
  CubitSectionSale() : super(const StateSectionSale());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
