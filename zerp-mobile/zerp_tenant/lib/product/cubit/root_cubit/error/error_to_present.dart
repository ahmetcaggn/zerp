final class ErrorToPresent {
  const ErrorToPresent({
    required this.message,
    this.duration = const Duration(seconds: 3),
  }) : assert(
         message != '',
         'ErrorToPresent.message cannot be empty',
       );

  final String message;
  final Duration duration;
}
