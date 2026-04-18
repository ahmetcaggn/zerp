import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';

@RoutePage()
class ScreenDashboard extends StatelessWidget {
  const ScreenDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Dashboard'));
  }
}
