import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/profile/cubit/cubit_profile.dart';
import 'package:zerp_tenant/feature/profile/cubit/permission/cubit_profile_permissions.dart';
import 'package:zerp_tenant/feature/profile/cubit/permission/state_profile_permissions.dart';
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
          create: (_) => getIt<CubitProfile>(),
        ),
        BlocProvider(
          create: (_) {
            final cubit = getIt<CubitProfilePermissions>();
            unawaited(cubit.loadPermissions());
            return cubit;
          },
        ),
      ],
      child: AppScaffold(
        title: context.t.profile.title,
        body: const CustomScrollView(
          slivers: [
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
    return BlocBuilder<CubitProfilePermissions, StateProfilePermissions>(
      builder: (context, state) {
        log.fine('Building permissions section with state: $state');
        return SliverMainAxisGroup(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  context.t.profile.permissions.title,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
            ),
            ...switch (state) {
              StateProfilePermissionsInitial() ||
              StateProfilePermissionsLoading() => [
                const SliverToBoxAdapter(
                  child: Center(child: CircularProgressIndicator()),
                ),
              ],
              StateProfilePermissionsError(:final message) => [
                SliverToBoxAdapter(
                  child: Center(child: Text(message)),
                ),
              ],
              StateProfilePermissionsLoaded(:final permissions) => [
                SliverList.builder(
                  itemCount: permissions.length,
                  itemBuilder: (context, index) {
                    final permission = permissions[index];
                    return ListTile(
                      leading: const Icon(Icons.security),
                      title: Text(permission.action?.value ?? ''),
                      subtitle: Text(
                        '${permission.targetType?.value ?? ''}: '
                        '${permission.targetId ?? ''}',
                      ),
                    );
                  },
                ),
              ],
            },
          ],
        );
      },
    );
  }
}
