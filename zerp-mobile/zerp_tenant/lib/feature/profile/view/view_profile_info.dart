import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/profile/cubit/cubit_profile.dart';

class ViewProfileInfo extends StatelessWidget {
  const ViewProfileInfo({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CubitProfile, StateProfile>(
      builder: (context, state) {
        if (state is StateProfileLoading || state is StateProfileInitial) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state is StateProfileError) {
          return Center(child: Text(state.message));
        }

        if (state is StateProfileLoaded) {
          final profile = state.profile;
          return Card(
            margin: const EdgeInsets.all(16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _ProfileRow(
                    icon: Icons.person,
                    label: 'Name',
                    value:
                        '${profile.firstName ?? ''} ${profile.lastName ?? ''}'
                            .trim(),
                  ),
                  const SizedBox(height: 16),
                  _ProfileRow(
                    icon: Icons.alternate_email,
                    label: 'Username',
                    value: profile.username ?? '',
                  ),
                  const SizedBox(height: 16),
                  _ProfileRow(
                    icon: Icons.email,
                    label: 'Email',
                    value: profile.email ?? '',
                  ),
                  const SizedBox(height: 16),
                  _ProfileRow(
                    icon: Icons.phone,
                    label: 'Phone',
                    value: profile.phoneNumber ?? '',
                  ),
                  const SizedBox(height: 16),
                  _ProfileRow(
                    icon: Icons.badge,
                    label: 'National ID',
                    value: profile.nationalId ?? '',
                  ),
                  const SizedBox(height: 16),
                  _ProfileRow(
                    icon: Icons.cake,
                    label: 'Date of Birth',
                    value: profile.dateOfBirth != null
                        ? '${profile.dateOfBirth!.day}/${profile.dateOfBirth!.month}/${profile.dateOfBirth!.year}'
                        : '',
                  ),
                  const SizedBox(height: 16),
                  _ProfileRow(
                    icon: Icons.info,
                    label: 'Status',
                    value: profile.status?.value ?? '',
                  ),
                  const SizedBox(height: 16),
                  _ProfileRow(
                    icon: Icons.supervisor_account,
                    label: 'Manager',
                    value: profile.manager != null
                        ? '${profile.manager!.firstName ?? ''} '
                                  '${profile.manager!.lastName ?? ''}'
                              .trim()
                        : '',
                  ),
                  if (profile.contacts.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Text(
                      'Contacts',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...profile.contacts.map((contact) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: _ProfileRow(
                          icon: _getContactIcon(contact.type),
                          label: contact.type?.value ?? 'Contact',
                          value:
                              // ignore: lines_longer_than_80_chars no way to fix
                              '${contact.value ?? ''} ${contact.contactPersonName != null ? '(${contact.contactPersonName})' : ''}'
                                  .trim(),
                        ),
                      );
                    }),
                  ],
                ],
              ),
            ),
          );
        }

        return const SizedBox.shrink();
      },
    );
  }

  IconData _getContactIcon(EmployeeContactDTOTypeEnum? type) {
    if (type == null) return Icons.contact_phone;
    return switch (type) {
      EmployeeContactDTOTypeEnum.WORK_PHONE => Icons.work,
      EmployeeContactDTOTypeEnum.PERSONAL_PHONE => Icons.phone_android,
      EmployeeContactDTOTypeEnum.WORK_EMAIL => Icons.alternate_email,
      EmployeeContactDTOTypeEnum.PERSONAL_EMAIL => Icons.email,
      EmployeeContactDTOTypeEnum.EMERGENCY_CONTACT => Icons.warning,
    };
  }
}

class _ProfileRow extends StatelessWidget {
  const _ProfileRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      children: [
        Icon(icon, color: theme.colorScheme.primary),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
            Text(
              value.isNotEmpty ? value : '-',
              style: theme.textTheme.bodyLarge,
            ),
          ],
        ),
      ],
    );
  }
}
