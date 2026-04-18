import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenEmployee extends StatelessWidget {
  const ScreenEmployee({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(child: Text(context.t.feature.employee));
  }
}
