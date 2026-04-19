import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenStore extends StatelessWidget {
  const ScreenStore({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(child: Text(context.t.feature.store));
  }
}
