import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:injectable/injectable.dart';

@module
abstract class ServiceModule {
  @lazySingleton
  FlutterAppAuth get appAuth => const FlutterAppAuth();

  @lazySingleton
  FlutterSecureStorage get secureStorage => const FlutterSecureStorage();
}
