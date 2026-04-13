import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';

@RoutePage()
class ScreenDashboard extends StatefulWidget {
  const ScreenDashboard({super.key});

  @override
  State<ScreenDashboard> createState() => _ScreenDashboardState();
}

class _ScreenDashboardState extends State<ScreenDashboard> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('Dashboard')),
    );
  }
}
