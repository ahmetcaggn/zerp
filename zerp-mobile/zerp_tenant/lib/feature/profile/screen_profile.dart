import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/profile/cubit/cubit_profile.dart';
import 'package:zerp_tenant/feature/profile/cubit/cubit_view_profile_permissions.dart';
import 'package:zerp_tenant/feature/profile/view/view_profile_info.dart';
import 'package:zerp_tenant/feature/profile/view/view_profile_permissions.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenProfile extends StatefulWidget {
  const ScreenProfile({super.key});

  @override
  State<ScreenProfile> createState() => _ScreenProfileState();
}

class _ScreenProfileState extends State<ScreenProfile>
    with LoggerMixin<ScreenProfile> {
  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (_) {
            final cubit = getIt<CubitProfile>();
            unawaited(cubit.loadProfile());
            return cubit;
          },
        ),
        BlocProvider(
          create: (_) {
            final cubit = getIt<CubitViewProfilePermissions>();
            unawaited(cubit.loadPermissions());
            return cubit;
          },
        ),
      ],
      child: AppScaffold(
        title: context.t.profile.title,
        body: const CustomScrollView(
          slivers: [
            SliverToBoxAdapter(child: ViewProfileInfo()),
            _PermissionsSection(),
          ],
        ),
      ),
    );
  }
}

class _PermissionsSection extends StatelessWidget
    with LoggerMixinConst<ScreenProfile> {
  const _PermissionsSection();

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child:
          BlocBuilder<CubitViewProfilePermissions, StateViewProfilePermissions>(
            builder: (context, state) {
              log.fine('Building permissions section with state: $state');
              return ViewProfilePermissions(state: state);
            },
          ),
    );
  }
}
