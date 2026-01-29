import 'dart:async';

import 'package:flutter/material.dart';

void main() async {
  await runZonedGuarded(
    () {
      runApp(const App());
    },
    (e, s) {
      // Handle uncaught errors here in the future
    },
  );
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
