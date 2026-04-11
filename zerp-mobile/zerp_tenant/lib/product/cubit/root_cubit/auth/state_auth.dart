sealed class StateAuth {
  const StateAuth();
}

final class StateAuthInitial extends StateAuth {
  const StateAuthInitial();
}

final class StateAuthAuthenticated extends StateAuth {
  const StateAuthAuthenticated({
    required this.username,
  });

  final String username;
}

final class StateAuthUnauthenticated extends StateAuth {
  const StateAuthUnauthenticated();
}
