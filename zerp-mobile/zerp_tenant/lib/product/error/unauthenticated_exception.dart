class UnauthenticatedException implements Exception {
  UnauthenticatedException(this.message);

  final String message;

  @override
  String toString() => 'UnauthenticatedException: $message';
}
