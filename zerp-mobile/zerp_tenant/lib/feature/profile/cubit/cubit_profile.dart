import 'package:injectable/injectable.dart';
import 'package:zerp_tenant/feature/profile/cubit/state_profile.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';

@injectable
class CubitProfile extends BaseCubit<StateProfile> {
  CubitProfile() : super(const StateProfileInitial());
}
