part of '../screen_manage_permission.dart';

mixin _MixinManagePermission on State<_ManagePermissionView> {
  final formKey = GlobalKey<FormState>();

  String? selectedActionStr;
  PermissionTargetType? selectedTargetType;
  late TextEditingController targetIdController;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    targetIdController = TextEditingController();
  }

  @override
  void dispose() {
    targetIdController.dispose();
    super.dispose();
  }

  Future<void> submit() async {
    if (_isSubmitting) return;

    if (formKey.currentState?.validate() ?? false) {
      if (selectedActionStr == null || selectedTargetType == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(context.t.permissionManage.errorSelectAction)),
        );
        return;
      }

      setState(() {
        _isSubmitting = true;
      });

      final actionEnum = PermissionCreateRequestDTOActionEnum.values.firstWhere(
        (e) => e.value == selectedActionStr,
        orElse: () => PermissionCreateRequestDTOActionEnum.READ_USER,
      );

      final targetTypeEnum = PermissionCreateRequestDTOTargetTypeEnum.values
          .firstWhere(
            (e) => e.value == selectedTargetType!.value,
            orElse: () => PermissionCreateRequestDTOTargetTypeEnum.USER,
          );

      await context.read<CubitManagePermission>().savePermission(
        employeeId: widget.employeeId,
        targetType: targetTypeEnum,
        action: actionEnum,
        targetId: targetIdController.text.isNotEmpty
            ? targetIdController.text
            : null,
      );
    }

    _isSubmitting = false;
  }

  void _listener(BuildContext context, StateManagePermission state) {
    if (state is StateManagePermissionSuccess) {
      setState(() {
        _isSubmitting = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(context.t.permissionManage.success)),
      );
      unawaited(context.router.maybePop());
    } else if (state is StateManagePermissionError) {
      setState(() {
        _isSubmitting = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(state.message)),
      );
    }
  }
}
