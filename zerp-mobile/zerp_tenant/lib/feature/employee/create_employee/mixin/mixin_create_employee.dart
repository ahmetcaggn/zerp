part of '../screen_create_employee.dart';

mixin _MixinCreateEmployee on State<_CreateEmployeeView> {
  final formKey = GlobalKey<FormState>();
  final usernameController = TextEditingController();
  final firstNameController = TextEditingController();
  final lastNameController = TextEditingController();
  final emailController = TextEditingController();
  final tempPasswordController = TextEditingController();
  final phoneController = TextEditingController();

  bool submitLock = false;

  @override
  void dispose() {
    usernameController.dispose();
    firstNameController.dispose();
    lastNameController.dispose();
    emailController.dispose();
    tempPasswordController.dispose();
    phoneController.dispose();
    super.dispose();
  }

  void _listener(BuildContext context, StateCreateEmployee state) {
    switch (state) {
      case StateCreateEmployeeInitial():
        break;
      case StateCreateEmployeeLoading():
        break;
      case StateCreateEmployeeError(:final message):
        context.read<CubitError>().enqueue(ErrorToPresent(message: message));
      case StateCreateEmployeeSucceed():
        unawaited(widget.cubitEmployee.loadEmployees());
        context.router.pop();
        unawaited(
          showDialog<void>(
            context: context,
            builder: (dialogContext) =>
                CreateEmployeeSuccessDialog(dialogContext: dialogContext),
          ),
        );
    }
  }

  Future<void> submit() async {
    if (submitLock) return;
    submitLock = true;
    if (formKey.currentState?.validate() ?? false) {
      final dto = CreateEmployeeRequestDto(
        username: usernameController.text.trim(),
        firstName: firstNameController.text.trim(),
        lastName: lastNameController.text.trim(),
        email: emailController.text.trim(),
        tempPassword: tempPasswordController.text,
        hireDate: DateTime.now(),
        phoneNumber: phoneController.text.isNotEmpty
            ? phoneController.text.trim()
            : null,
      );

      await context.read<CubitCreateEmployee>().createEmployee(dto);
    }
    submitLock = false;
  }
}
