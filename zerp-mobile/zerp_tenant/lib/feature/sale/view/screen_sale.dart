import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';

@RoutePage()
class ScreenSale extends StatefulWidget {
  const ScreenSale({super.key});

  @override
  State<ScreenSale> createState() => _ScreenSaleState();
}

class _ScreenSaleState extends State<ScreenSale> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('Sale')),
    );
  }
}
