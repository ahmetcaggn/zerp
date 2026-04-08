import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';

@RoutePage()
class ScreenStock extends StatefulWidget {
  const ScreenStock({super.key});

  @override
  State<ScreenStock> createState() => _ScreenStockState();
}

class _ScreenStockState extends State<ScreenStock> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('Stock')),
    );
  }
}
