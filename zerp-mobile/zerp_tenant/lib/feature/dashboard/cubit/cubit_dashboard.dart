import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/dashboard/cubit/state_dashboard.dart';

class CubitDashboard extends Cubit<StateDashboard> {
  CubitDashboard() : super(const StateDashboard(count: 0));

  void changeTab(int index) => emit(state.copyWith(count: index));
}
