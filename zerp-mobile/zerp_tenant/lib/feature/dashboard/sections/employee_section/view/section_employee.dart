import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class SectionEmployee extends StatelessWidget {
  const SectionEmployee({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Text(context.t.section.employee)),
    );
  }
}
