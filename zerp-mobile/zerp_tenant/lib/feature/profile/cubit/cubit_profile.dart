import 'package:injectable/injectable.dart';
import 'package:openapi_user/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/service/user/user_profile_service.dart';

@injectable
class CubitProfile extends BaseCubit<StateProfile>
    with LoggerMixin<CubitProfile> {
  CubitProfile(this._userProfileService) : super(const StateProfileInitial());

  final UserProfileService _userProfileService;

  Future<void> loadProfile() async {
    emit(const StateProfileLoading());
    try {
      final profile = await _userProfileService.getCurrentUserProfile();
      emit(StateProfileLoaded(profile: profile));
    } on Object catch (e) {
      log.severe('Error loading user profile: $e');
      emit(StateProfileError(message: e.toString()));
    }
  }
}

sealed class StateProfile {
  const StateProfile();
}

final class StateProfileInitial extends StateProfile {
  const StateProfileInitial();
}

final class StateProfileLoading extends StateProfile {
  const StateProfileLoading();
}

final class StateProfileLoaded extends StateProfile {
  const StateProfileLoaded({
    required this.profile,
  });

  final CurrentUserProfileDTO profile;
}

final class StateProfileError extends StateProfile {
  const StateProfileError({
    required this.message,
  });

  final String message;
}
