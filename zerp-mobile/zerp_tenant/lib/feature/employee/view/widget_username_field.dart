import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/employee/cubit/cubit_employee_username.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class WidgetUsernameField extends StatelessWidget {
  const WidgetUsernameField({
    required this.usernameController,
    super.key,
  });

  final TextEditingController usernameController;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CubitEmployeeUsername, StateEmployeeUsername>(
      builder: (context, state) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextFormField(
              controller: usernameController,
              decoration: InputDecoration(
                labelText: '${context.t.employee.create.username} *',
                suffixIcon: _getSuffixIcon(state),
              ),
              validator: (val) =>
                  (val == null ||
                      val.isEmpty ||
                      val.length < 3 ||
                      val.length > 255)
                  ? context.t.employee.create.required(
                      target: t.employee.create.username,
                    )
                  : null,
              onChanged: (value) {
                context.read<CubitEmployeeUsername>().onChanged(value);
              },
            ),
            if (state is StateEmployeeUsernameError)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  state.message,
                  style: TextStyle(color: Theme.of(context).colorScheme.error),
                ),
              )
            else if (state is StateEmployeeUsernameTaken)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  context.t.employee.create.usernameTaken,
                  style: TextStyle(color: Theme.of(context).colorScheme.error),
                ),
              ),
          ],
        );
      },
    );
  }

  Icon? _getSuffixIcon(StateEmployeeUsername state) {
    switch (state) {
      case StateEmployeeUsernameInitial():
        return null;
      case StateEmployeeUsernameLoading():
        return null;
      case StateEmployeeUsernameAvailable():
        return const Icon(Icons.check, color: Colors.green);
      case StateEmployeeUsernameTaken():
        return const Icon(Icons.close, color: Colors.red);
      case StateEmployeeUsernameError():
        return const Icon(Icons.error, color: Colors.orange);
    }
  }
}
