import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/auth/view/mixin/auth_mixin.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/state_auth.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

typedef AfterAuthCallback = void Function();

@RoutePage()
class ScreenAuth extends StatefulWidget {
  const ScreenAuth({
    super.key,
    this.afterAuthCallback,
    this.callerRoute,
  });

  final AfterAuthCallback? afterAuthCallback;
  final String? callerRoute;

  @override
  State<ScreenAuth> createState() => _ScreenAuthState();
}

class _ScreenAuthState extends State<ScreenAuth> with AuthMixin {
  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: context.t.auth.login,
      body: Center(
        child: BlocBuilder<CubitAuth, StateAuth>(
          builder: (context, state) {
            final isAuthActionInProgress = state is StateAuthLoading;
            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (state is StateAuthError)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Text(state.message),
                  )
                else
                  const SizedBox.shrink(),
                ElevatedButton(
                  onPressed: isAuthActionInProgress ? null : onLoginPressed,
                  child: Text(context.t.auth.login),
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: isAuthActionInProgress ? null : onRegisterPressed,
                  child: Text(context.t.auth.signUp),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
