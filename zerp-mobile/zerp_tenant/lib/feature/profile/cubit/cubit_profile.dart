import 'package:injectable/injectable.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';

@injectable
class CubitProfile extends BaseCubit<StateProfile> {
  CubitProfile() : super(const StateProfileInitial());
}

sealed class StateProfile {
  const StateProfile();
}

final class StateProfileInitial extends StateProfile {
  const StateProfileInitial();
}
