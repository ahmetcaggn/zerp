import 'package:flutter/material.dart';
import 'package:openapi_user/api.dart';

class WidgetPermittableTile extends StatelessWidget {
  const WidgetPermittableTile({
    required this.permittable,
    this.onTap,
    super.key,
  });

  final PermittableResponseDTO permittable;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(permittable.title ?? '-'),
      subtitle: Text(permittable.id ?? '-'),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}
