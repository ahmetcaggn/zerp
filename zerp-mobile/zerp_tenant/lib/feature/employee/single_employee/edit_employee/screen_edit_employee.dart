import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_employee/api.dart';
import 'package:zerp_tenant/feature/employee/cubit/cubit_employee.dart';
import 'package:zerp_tenant/feature/employee/cubit/cubit_employee_username.dart';
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_single_employee.dart';
import 'package:zerp_tenant/feature/employee/single_employee/edit_employee/cubit_edit_employee.dart';
import 'package:zerp_tenant/feature/employee/view/widget_username_field.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenEditEmployee extends StatelessWidget {
  const ScreenEditEmployee({
    required this.employeeId,
    required this.cubitSingleEmployee,
    required this.cubitEmployee,
    super.key,
  });

  final String employeeId;
  final CubitSingleEmployee cubitSingleEmployee;
  final CubitEmployee cubitEmployee;

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) =>
              getIt<CubitEditEmployee>(param1: cubitSingleEmployee),
        ),
        BlocProvider(create: (_) => getIt<CubitEmployeeUsername>()),
      ],
      child: _EditEmployeeView(
        employeeId: employeeId,
        cubitEmployee: cubitEmployee,
      ),
    );
  }
}

class _EditEmployeeView extends StatefulWidget {
  const _EditEmployeeView({
    required this.employeeId,
    required this.cubitEmployee,
  });

  final String employeeId;
  final CubitEmployee cubitEmployee;

  @override
  State<_EditEmployeeView> createState() => _EditEmployeeViewState();
}

class _EditEmployeeViewState extends State<_EditEmployeeView> {
  final formKey = GlobalKey<FormState>();
  late TextEditingController usernameController;
  late TextEditingController firstNameController;
  late TextEditingController lastNameController;
  late TextEditingController emailController;
  late TextEditingController phoneController;
  late TextEditingController nationalIdController;
  late TextEditingController salaryController;

  @override
  void initState() {
    super.initState();
    final cubitSingleEmployee = context
        .read<CubitEditEmployee>()
        .cubitSingleEmployee;
    final state = cubitSingleEmployee.state;
    EmployeeResponseDto? employee;
    if (state is StateSingleEmployeeLoaded) {
      employee = state.data;
    }

    usernameController = TextEditingController(text: employee?.username ?? '');

    firstNameController = TextEditingController(
      text: employee?.firstName ?? '',
    );
    lastNameController = TextEditingController(text: employee?.lastName ?? '');
    emailController = TextEditingController(text: employee?.email ?? '');
    phoneController = TextEditingController(text: employee?.phoneNumber ?? '');
    nationalIdController = TextEditingController(
      text: employee?.nationalId ?? '',
    );
    salaryController = TextEditingController(
      text: employee?.salary?.toString() ?? '',
    );
  }

  @override
  void dispose() {
    usernameController.dispose();
    firstNameController.dispose();
    lastNameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    nationalIdController.dispose();
    salaryController.dispose();
    super.dispose();
  }

  void submit() {
    if (formKey.currentState?.validate() ?? false) {
      final request = UpdateEmployeeRequestDto(
        username: usernameController.text.isNotEmpty
            ? usernameController.text
            : null,
        firstName: firstNameController.text.isNotEmpty
            ? firstNameController.text
            : null,
        lastName: lastNameController.text.isNotEmpty
            ? lastNameController.text
            : null,
        email: emailController.text.isNotEmpty ? emailController.text : null,
        phoneNumber: phoneController.text.isNotEmpty
            ? phoneController.text
            : null,
        nationalId: nationalIdController.text.isNotEmpty
            ? nationalIdController.text
            : null,
        salary: num.tryParse(salaryController.text),
      );
      unawaited(
        context.read<CubitEditEmployee>().updateEmployee(
          widget.employeeId,
          request,
        ),
      );
    }
  }

  void _listener(BuildContext context, StateEditEmployee state) {
    if (state is StateEditEmployeeSuccess) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(context.t.employee.edit.success)),
      );
      unawaited(widget.cubitEmployee.loadEmployees());
      unawaited(context.router.maybePop());
    } else if (state is StateEditEmployeeError) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(state.message)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(context.t.employee.edit.title),
      ),
      body: BlocListener<CubitEditEmployee, StateEditEmployee>(
        listener: _listener,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: formKey,
            child: ListView(
              children: [
                WidgetUsernameField(usernameController: usernameController),
                const SizedBox(height: 16),
                TextFormField(
                  controller: firstNameController,
                  decoration: InputDecoration(
                    labelText: context.t.employee.edit.firstName,
                  ),
                  validator: (val) => (val == null || val.isEmpty)
                      ? context.t.common.required
                      : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: lastNameController,
                  decoration: InputDecoration(
                    labelText: context.t.employee.edit.lastName,
                  ),
                  validator: (val) => (val == null || val.isEmpty)
                      ? context.t.common.required
                      : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                    labelText: context.t.employee.edit.email,
                  ),
                  validator: (val) => (val == null || val.isEmpty)
                      ? context.t.common.required
                      : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: InputDecoration(
                    labelText: context.t.employee.edit.phoneNumber,
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: nationalIdController,
                  decoration: InputDecoration(
                    labelText: context.t.employee.edit.nationalId,
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: salaryController,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: InputDecoration(
                    labelText: context.t.employee.edit.salary,
                  ),
                ),
                const SizedBox(height: 32),
                BlocBuilder<CubitEditEmployee, StateEditEmployee>(
                  builder: (context, state) {
                    final isLoading = state is StateEditEmployeeLoading;
                    return ElevatedButton(
                      onPressed: isLoading ? null : submit,
                      child: isLoading
                          ? const CircularProgressIndicator()
                          : Text(context.t.employee.edit.submit),
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
