import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenSettings extends StatefulWidget {
  const ScreenSettings({super.key});

  @override
  State<ScreenSettings> createState() => _ScreenSettingsState();
}

class _ScreenSettingsState extends State<ScreenSettings> {
  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: context.t.shell.settings,
      body: Center(child: Text(context.t.feature.settings)),
    );
  }
}
