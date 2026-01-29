import 'package:envied/envied.dart';
import 'package:flutter/foundation.dart';

part 'app_env.g.dart';

@Envied(
  path: '.prod.env',
  name: 'Prod',
  allowOptionalFields: true,
  obfuscate: true,
)
@Envied(
  path: '.dev.env',
  name: 'Dev',
  allowOptionalFields: true,
  obfuscate: true,
)
final class AppEnv {
  factory AppEnv() => _instance;
  static final AppEnv _instance = switch (kDebugMode) {
    true => _Dev(),
    false => _Prod(),
  };
}
