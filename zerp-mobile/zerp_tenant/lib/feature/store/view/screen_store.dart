import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';

@RoutePage()
class ScreenStore extends StatefulWidget {
  const ScreenStore({super.key});

  @override
  State<ScreenStore> createState() => _ScreenStoreState();
}

class _ScreenStoreState extends State<ScreenStore> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('Store')),
    );
  }
}
