import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/state_auth.dart';

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

class _ScreenAuthState extends State<ScreenAuth> {
  @override
  void initState() {
    super.initState();
    unawaited(context.read<CubitAuth>().checkAuth());
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<CubitAuth, StateAuth>(
      listener: (context, state) async {
        if (state is StateAuthAuthenticated) {
          widget.afterAuthCallback?.call();
          final callerRoute = widget.callerRoute;
          if (callerRoute != null) {
            await context.router.replacePath(callerRoute);
          } else {
            context.router.pop();
          }
        }
      },
      child: Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              BlocBuilder<CubitAuth, StateAuth>(
                builder: (context, state) {
                  if (state is StateAuthError) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Text(state.message),
                    );
                  }
                  return const SizedBox.shrink();
                },
              ),
              ElevatedButton(
                onPressed: () async {
                  await context.read<CubitAuth>().redirectLogin();
                },
                child: const Text('Login'),
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: () async {
                  await context.read<CubitAuth>().redirectSignUp();
                },
                child: const Text('Sign Up'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
