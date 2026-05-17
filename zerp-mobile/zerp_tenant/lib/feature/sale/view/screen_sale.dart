import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenSale extends StatelessWidget {
  const ScreenSale({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: context.t.shell.sales,
      body: Center(child: Text(context.t.feature.sale)),
    );
  }
}
