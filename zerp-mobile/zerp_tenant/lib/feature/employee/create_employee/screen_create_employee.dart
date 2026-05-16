import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_employee/api.dart';
import 'package:zerp_tenant/feature/employee/create_employee/cubit/cubit_create_employee.dart';
import 'package:zerp_tenant/feature/employee/create_employee/view/create_employee_success_dialog.dart';
import 'package:zerp_tenant/feature/employee/cubit/cubit_employee.dart';
import 'package:zerp_tenant/feature/employee/cubit/cubit_employee_username.dart';
import 'package:zerp_tenant/feature/employee/view/widget_username_field.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/cubit_error.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

part 'mixin/mixin_create_employee.dart';

@RoutePage()
class ScreenCreateEmployee extends StatelessWidget {
  const ScreenCreateEmployee({
    required this.cubitEmployee,
    super.key,
  });

  final CubitEmployee cubitEmployee;

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<CubitCreateEmployee>()),
        BlocProvider(create: (_) => getIt<CubitEmployeeUsername>()),
      ],
      child: _CreateEmployeeView(cubitEmployee: cubitEmployee),
    );
  }
}

class _CreateEmployeeView extends StatefulWidget {
  const _CreateEmployeeView({
    required this.cubitEmployee,
  });

  final CubitEmployee cubitEmployee;

  @override
  State<_CreateEmployeeView> createState() => _CreateEmployeeViewState();
}

class _CreateEmployeeViewState extends State<_CreateEmployeeView>
    with _MixinCreateEmployee {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(context.t.employee.create.title),
      ),
      body: BlocListener<CubitCreateEmployee, StateCreateEmployee>(
        listener: _listener,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: formKey,
            child: ListView(
              children: [
                WidgetUsernameField(
                  usernameController: usernameController,
                ),
                const SizedBox(height: 16),
                _FirstNameField(controller: firstNameController),
                const SizedBox(height: 16),
                _LastNameField(controller: lastNameController),
                const SizedBox(height: 16),
                _EmailField(controller: emailController),
                const SizedBox(height: 16),
                _PasswordField(controller: tempPasswordController),
                const SizedBox(height: 16),
                _PhoneField(controller: phoneController),
                const SizedBox(height: 32),
                BlocBuilder<CubitCreateEmployee, StateCreateEmployee>(
                  builder: (context, state) {
                    final isLoading = state is StateCreateEmployeeLoading;
                    return _SubmitButton(
                      isLoading: isLoading,
                      onSubmit: submit,
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _FirstNameField extends StatelessWidget {
  const _FirstNameField({required this.controller});

  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: '${context.t.employee.create.firstName} *',
      ),
      validator: (val) => (val == null || val.isEmpty)
          ? context.t.employee.create.required(
              target: t.employee.create.firstName,
            )
          : null,
    );
  }
}

class _LastNameField extends StatelessWidget {
  const _LastNameField({required this.controller});

  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: '${context.t.employee.create.lastName} *',
      ),
      validator: (val) => (val == null || val.isEmpty)
          ? context.t.employee.create.required(
              target: t.employee.create.lastName,
            )
          : null,
    );
  }
}

class _EmailField extends StatelessWidget {
  const _EmailField({required this.controller});

  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: TextInputType.emailAddress,
      decoration: InputDecoration(
        labelText: '${context.t.employee.create.email} *',
      ),
      validator: (val) => (val == null || val.isEmpty)
          ? context.t.employee.create.required(
              target: t.employee.create.email,
            )
          : null,
    );
  }
}

class _PasswordField extends StatefulWidget {
  const _PasswordField({required this.controller});

  final TextEditingController controller;

  @override
  State<_PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<_PasswordField> {
  bool isObscure = true;

  void onToggle() {
    setState(() {
      isObscure = !isObscure;
    });
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      obscureText: isObscure,
      decoration: InputDecoration(
        labelText: '${context.t.employee.create.tempPassword} *',
        suffixIcon: IconButton(
          icon: Icon(
            isObscure ? Icons.visibility_off : Icons.visibility,
          ),
          onPressed: onToggle,
        ),
      ),
      validator: (val) => (val == null || val.isEmpty)
          ? context.t.employee.create.required(
              target: t.employee.create.tempPassword,
            )
          : null,
    );
  }
}

class _PhoneField extends StatelessWidget {
  const _PhoneField({required this.controller});

  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: TextInputType.phone,
      decoration: InputDecoration(
        labelText: context.t.employee.create.phoneNumber,
      ),
    );
  }
}

class _SubmitButton extends StatelessWidget {
  const _SubmitButton({
    required this.isLoading,
    required this.onSubmit,
  });

  final bool isLoading;
  final VoidCallback onSubmit;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: isLoading ? null : onSubmit,
      child: isLoading
          ? const CircularProgressIndicator()
          : Text(context.t.employee.create.submit),
    );
  }
}
