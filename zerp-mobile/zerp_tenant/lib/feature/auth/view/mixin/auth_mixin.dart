import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/auth/view/screen_auth.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/auth/cubit_auth.dart';

mixin AuthMixin on State<ScreenAuth> {
  Future<void> onLoginPressed() async {
    await context.read<CubitAuth>().redirectLogin();
  }
}
