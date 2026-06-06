sealed class StateAuth {
  const StateAuth();
}

final class StateAuthInitial extends StateAuth {
  const StateAuthInitial();
}

final class StateAuthLoading extends StateAuth {
  const StateAuthLoading();
}

final class StateAuthAuthenticated extends StateAuth {
  const StateAuthAuthenticated({
    required this.username,
    this.email,
  });

  final String username;
  final String? email;
}

final class StateAuthUnauthenticated extends StateAuth {
  const StateAuthUnauthenticated();
}

final class StateAuthError extends StateAuth {
  const StateAuthError({
    required this.message,
  }) : assert(
         message != '',
         'StateAuthError.message cannot be empty',
       );

  final String message;
}
