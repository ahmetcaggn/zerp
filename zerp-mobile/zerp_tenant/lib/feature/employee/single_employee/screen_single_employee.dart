import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_employee/api.dart';
import 'package:zerp_tenant/feature/employee/cubit/cubit_employee.dart';
import 'package:zerp_tenant/feature/employee/single_employee/cubit/cubit_single_employee.dart';
import 'package:zerp_tenant/feature/employee/single_employee/view/permissions_viewer.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/cubit_error.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';
import 'package:zerp_tenant/product/util/employee_response_extensions.dart';

@RoutePage()
final class ScreenSingleEmployee extends StatelessWidget {
  const ScreenSingleEmployee({
    required this.employeeId,
    required this.cubitEmployee,
    super.key,
  });

  final String employeeId;
  final CubitEmployee cubitEmployee;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt.get<CubitSingleEmployee>();
        unawaited(cubit.loadEmployee(employeeId));
        return cubit;
      },
      child: _View(
        employeeId: employeeId,
        cubitEmployee: cubitEmployee,
      ),
    );
  }
}

class _View extends StatelessWidget {
  const _View({
    required this.employeeId,
    required this.cubitEmployee,
  });

  final String employeeId;
  final CubitEmployee cubitEmployee;

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: context.t.employee.details.title,
      actions: [
        IconButton(
          icon: const Icon(Icons.edit_outlined),
          onPressed: () {
            final cubit = context.read<CubitSingleEmployee>();
            unawaited(
              context.router.push(
                RouteEditEmployee(
                  employeeId: employeeId,
                  cubitSingleEmployee: cubit,
                  cubitEmployee: cubitEmployee,
                ),
              ),
            );
          },
        ),
      ],
      body: const _EmployeeViewer(),
    );
  }
}

class _EmployeeViewer extends StatelessWidget {
  const _EmployeeViewer();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CubitSingleEmployee, StateSingleEmployee>(
      builder: (context, state) {
        if (state is StateSingleEmployeeLoading) {
          return const Center(child: CircularProgressIndicator());
        } else if (state is StateSingleEmployeeLoaded) {
          final employee = state.data;
          final employeeId = employee.id;
          if (employeeId == null) {
            context.read<CubitError>().enqueue(
              ErrorToPresent(
                message: context.t.employee.details.errors.noIdProvided,
              ),
            );
            return Center(
              child: Text(context.t.employee.details.errors.noIdProvided),
            );
          }

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _DetailsView(employee: employee),
              if (employee.contacts.isNotEmpty) ...[
                const SizedBox(height: 16),
                _ContactDetails(employee: employee),
              ],
              const SizedBox(height: 16),
              PermissionsViewer(employeeId: employeeId),
            ],
          );
        } else if (state is StateSingleEmployeeError) {
          return Center(
            child: Text(state.message),
          );
        } else {
          return const SizedBox.shrink();
        }
      },
    );
  }
}

class _DetailsView extends StatelessWidget {
  const _DetailsView({
    required this.employee,
  });

  final EmployeeResponseDto employee;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: Theme.of(context).colorScheme.outlineVariant,
        ),
      ),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: Theme.of(
                    context,
                  ).colorScheme.primaryContainer,
                  child: Text(
                    employee.firstName?.substring(0, 1).toUpperCase() ?? '?',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Theme.of(
                        context,
                      ).colorScheme.onPrimaryContainer,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        employee.fullName,
                        style: Theme.of(context).textTheme.titleMedium
                            ?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      if (employee.status != null)
                        Container(
                          margin: const EdgeInsets.only(top: 4),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: Theme.of(
                              context,
                            ).colorScheme.secondaryContainer,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            employee.status!.value,
                            style: Theme.of(context).textTheme.labelSmall
                                ?.copyWith(
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.onSecondaryContainer,
                                ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            _DetailRow(
              icon: Icons.person_outline,
              label: context.t.employee.details.username,
              value: employee.username,
            ),
            _DetailRow(
              icon: Icons.email_outlined,
              label: context.t.employee.details.email,
              value: employee.email,
            ),
            _DetailRow(
              icon: Icons.phone_outlined,
              label: context.t.employee.details.phoneNumber,
              value: employee.phoneNumber,
            ),
            _DetailRow(
              icon: Icons.badge_outlined,
              label: context.t.employee.details.nationalId,
              value: employee.nationalId,
            ),
            _DetailRow(
              icon: Icons.calendar_today_outlined,
              label: context.t.employee.details.dateOfBirth,
              value: employee.dateOfBirth?.toIso8601String().substring(0, 10),
            ),
            _DetailRow(
              icon: Icons.work_outline,
              label: context.t.employee.details.hireDate,
              value: employee.hireDate?.toIso8601String().substring(0, 10),
            ),
            _DetailRow(
              icon: Icons.attach_money_outlined,
              label: context.t.employee.details.salary,
              value: employee.salary?.toString(),
            ),
            if (employee.manager != null)
              _DetailRow(
                icon: Icons.person_outline,
                label: context.t.employee.details.manager,
                value:
                    '${employee.manager!.firstName} '
                    '${employee.manager!.lastName}',
              ),
            _DetailRow(
              icon: Icons.event_busy_outlined,
              label: context.t.employee.details.terminationDate,
              value: employee.terminationDate?.toIso8601String().substring(
                0,
                10,
              ),
            ),
            _DetailRow(
              icon: Icons.access_time_outlined,
              label: context.t.employee.details.createdAt,
              value: employee.createdAt
                  ?.toIso8601String()
                  .replaceFirst('T', ' ')
                  .substring(0, 16),
            ),
            _DetailRow(
              icon: Icons.update_outlined,
              label: context.t.employee.details.updatedAt,
              value: employee.updatedAt
                  ?.toIso8601String()
                  .replaceFirst('T', ' ')
                  .substring(0, 16),
            ),
          ],
        ),
      ),
    );
  }
}

class _ContactDetails extends StatelessWidget {
  const _ContactDetails({
    required this.employee,
  });

  final EmployeeResponseDto employee;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: Theme.of(context).colorScheme.outlineVariant,
        ),
      ),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.contact_phone_outlined,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Text(
                  context.t.employee.details.contacts,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...employee.contacts.map((contact) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.contacts_outlined,
                      size: 20,
                      color: Theme.of(
                        context,
                      ).colorScheme.onSurfaceVariant,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            contact.type?.value.replaceAll(
                                  '_',
                                  ' ',
                                ) ??
                                context.t.common.unknown,
                            style: Theme.of(context).textTheme.labelMedium
                                ?.copyWith(
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.onSurfaceVariant,
                                ),
                          ),
                          Text(
                            contact.value ?? '-',
                            style: Theme.of(
                              context,
                            ).textTheme.bodyMedium,
                          ),
                          if (contact.contactPersonName != null)
                            Text(
                              context.t.employee.details.contactPerson(
                                name: contact.contactPersonName!,
                              ),
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          if (contact.relationship != null)
                            Text(
                              context.t.employee.details.relationship(
                                relationship: contact.relationship!,
                              ),
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String? value;

  @override
  Widget build(BuildContext context) {
    if (value == null || value!.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            size: 20,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
                Text(
                  value!,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
