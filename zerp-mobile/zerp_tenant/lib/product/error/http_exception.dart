class HttpException implements Exception {
  HttpException({
    required this.message,
    required this.statusCode,
  });

  final String message;
  final int statusCode;

  @override
  String toString() => 'HTTPException($statusCode): $message';
}
