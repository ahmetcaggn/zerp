import 'package:flutter/material.dart';
import 'package:zerp_tenant/feature/app_root.dart';
import 'package:zerp_tenant/product/init/app_initializer.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AppInitializer.initialize();
  runApp(const AppRoot());
}
