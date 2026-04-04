import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/dashboard/sections/store_section/cubit/state_section_store.dart';

class CubitSectionStore extends Cubit<StateSectionStore> {
  CubitSectionStore() : super(const StateSectionStore());

  void setLoading({required bool isLoading}) {
    emit(state.copyWith(isLoading: isLoading));
  }
}
