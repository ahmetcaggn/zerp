import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_employee/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/feature/employee/cubit/cubit_employee.dart';
import 'package:zerp_tenant/feature/employee/cubit/state_employee.dart';
import 'package:zerp_tenant/feature/employee/single_employee/screen_single_employee.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/error/cubit_error.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';
import 'package:zerp_tenant/product/util/employee_response_extensions.dart';

@RoutePage()
class ScreenEmployee extends StatelessWidget {
  const ScreenEmployee({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt<CubitEmployee>();
        unawaited(cubit.loadEmployees());
        return cubit;
      },
      child: Column(
        children: [
          const _CreateEmployeeButton(),
          const _EmployeeListHeader(),
          Expanded(child: _EmployeeList()),
        ],
      ),
    );
  }
}

class _EmployeeListHeader extends StatelessWidget {
  const _EmployeeListHeader();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const SizedBox(width: 16),
        BlocBuilder<CubitEmployee, StateEmployee>(
          builder: (context, state) {
            switch (state) {
              case StateEmployeeInitial() || StateEmployeeLoading():
                return Text(context.t.employee.list.loading);
              case StateEmployeeError():
                return Text(context.t.employee.list.error);
              case StateEmployeeLoaded(:final data):
                return Text(
                  context.t.employee.list.title(total: data.totalCount),
                  style: Theme.of(context).textTheme.headlineSmall,
                );
            }
          },
        ),
        const Spacer(),
        IconButton(
          onPressed: () => context.read<CubitEmployee>().loadEmployees(),
          icon: const Icon(Icons.refresh),
        ),
        const SizedBox(width: 16),
      ],
    );
  }
}

class _CreateEmployeeButton extends StatelessWidget
    with LoggerMixinConst<ScreenEmployee> {
  const _CreateEmployeeButton();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () async {
            await context.router.push(
              RouteCreateEmployee(cubitEmployee: context.read<CubitEmployee>()),
            );
          },
          icon: const Icon(Icons.person_add),
          label: Text(context.t.employee.list.create),
        ),
      ),
    );
  }
}

final class _EmployeeList extends StatelessWidget
    with LoggerMixin<ScreenEmployee> {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CubitEmployee, StateEmployee>(
      builder: (context, state) {
        return switch (state) {
          StateEmployeeInitial() || StateEmployeeLoading() => const Center(
            child: CircularProgressIndicator(),
          ),
          StateEmployeeError() => _ErrorViewer(state: state),
          StateEmployeeLoaded(:final data) =>
            data.items.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.people_outline,
                          size: 48,
                          color: Colors.grey,
                        ),
                        const SizedBox(height: 16),
                        Text(context.t.employee.list.noEmployees),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemBuilder: (context, index) {
                      final employee = data.items[index];
                      return _EmployeeEntry(employee: employee);
                    },
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: 8),
                    itemCount: data.items.length,
                  ),
        };
      },
    );
  }
}

class _ErrorViewer extends StatelessWidget {
  const _ErrorViewer({
    required this.state,
  });

  final StateEmployeeError state;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 48, color: Colors.red),
          const SizedBox(height: 16),
          Text(state.message, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => context.read<CubitEmployee>().loadEmployees(),
            child: Text(context.t.employee.list.retry),
          ),
        ],
      ),
    );
  }
}

class _EmployeeEntry extends StatelessWidget
    with LoggerMixinConst<ScreenSingleEmployee> {
  const _EmployeeEntry({
    required this.employee,
  });

  final EmployeeListResponseDto employee;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 8,
        ),
        leading: CircleAvatar(
          child: Text(
            employee.fullName.isNotEmpty
                ? employee.fullName[0].toUpperCase()
                : '?',
          ),
        ),
        title: Text(
          employee.fullName,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Row(
            children: [
              Icon(
                Icons.circle,
                size: 12,
                color:
                    employee.status == EmployeeListResponseDtoStatusEnum.ACTIVE
                    ? Colors.green
                    : Colors.grey,
              ),
              const SizedBox(width: 4),
              Text(
                employee.status?.value ?? context.t.employee.list.statusUnknown,
              ),
            ],
          ),
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: () => _onTap(context),
      ),
    );
  }

  Future<void> _onTap(BuildContext context) async {
    if (employee.id != null) {
      await context.router.push(
        RouteSingleEmployee(
          employeeId: employee.id ?? '',
          cubitEmployee: context.read<CubitEmployee>(),
        ),
      );
    } else {
      log.severe(
        'Employee ID is null for employee: ${employee.fullName}',
      );
      context.read<CubitError>().enqueue(
        ErrorToPresent(
          message: context.t.employee.details.errors.missingId(
            name: employee.fullName,
          ),
        ),
      );
    }
  }
}
