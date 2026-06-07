import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/profile/permission/cubit_profile_permissions.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/permission/cubit_permission.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';
import 'package:zerp_tenant/product/ui/widget/permission/permission_scope.dart';

@RoutePage()
class ScreenProfilePermissions extends StatelessWidget {
  const ScreenProfilePermissions({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt<CubitProfilePermissions>();
        unawaited(cubit.loadPermissions());
        return cubit;
      },
      child: const _ProfilePermissionsView(),
    );
  }
}

class _ProfilePermissionsView extends StatelessWidget {
  const _ProfilePermissionsView();

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: AppScaffold(
        title: context.t.profile.permissions.title,
        actions: [
          IconButton(
            tooltip: context.t.common.refresh,
            onPressed: () {
              // Refresh the flat list used by the List view
              unawaited(
                context.read<CubitProfilePermissions>().loadPermissions(),
              );
              // Refresh the main permission tree used by the Tree view and
              // guards
              unawaited(
                context.read<CubitPermission>().loadPermissionsForced(),
              );
            },
            icon: const Icon(Icons.refresh),
          ),
        ],
        appBarBottom: TabBar(
          tabs: [
            Tab(text: context.t.profile.permissions.listView),
            Tab(text: context.t.profile.permissions.treeView),
          ],
        ),
        body: TabBarView(
          children: [
            BlocBuilder<CubitProfilePermissions, StateProfilePermissions>(
              builder: (context, state) {
                return switch (state) {
                  StateProfilePermissionsInitial() ||
                  StateProfilePermissionsLoading() => const Center(
                    child: CircularProgressIndicator(),
                  ),
                  StateProfilePermissionsError(:final message) => Center(
                    child: Text(message),
                  ),
                  StateProfilePermissionsLoaded() => _ListSection(
                    state: state,
                  ),
                };
              },
            ),
            const _TreeSection(),
          ],
        ),
      ),
    );
  }
}

class _TreeSection extends StatelessWidget {
  const _TreeSection();

  @override
  Widget build(BuildContext context) {
    final state = PermissionScope.maybeOf(context);
    if (state is! StatePermissionLoaded) {
      return Center(child: Text(context.t.permission.notLoaded));
    }

    final tree = state.tree;

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      children: [
        _TreeNodeWidget(node: tree),
      ],
    );
  }
}

class _TreeNodeWidget extends StatelessWidget {
  const _TreeNodeWidget({required this.node});

  final PermittableTreeNodeDTO node;

  @override
  Widget build(BuildContext context) {
    final title = node.title ??
        node.targetType?.value ??
        node.id ??
        context.t.permission.globalNode;
    final hasActions = node.actions.isNotEmpty;
    final hasChildren = node.children.isNotEmpty;

    if (!hasActions && !hasChildren) {
      return const SizedBox.shrink();
    }

    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 4),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(
          color: Theme.of(
            context,
          ).colorScheme.outlineVariant.withValues(alpha: 0.5),
        ),
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          initiallyExpanded: true,
          shape: const Border(),
          collapsedShape: const Border(),
          leading: Icon(
            hasChildren
                ? Icons.folder_outlined
                : Icons.insert_drive_file_outlined,
            color: Theme.of(context).colorScheme.primary,
          ),
          title: Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          subtitle: hasActions
              ? Text(
                  node.actions.map((e) => e.value).join(', '),
                  style: TextStyle(
                    fontSize: 12,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                )
              : null,
          children: [
            if (hasChildren)
              Padding(
                padding: const EdgeInsets.only(left: 16),
                child: Column(
                  children: node.children
                      .map((child) => _TreeNodeWidget(node: child))
                      .toList(),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _ListSection extends StatefulWidget {
  const _ListSection({required this.state});

  final StateProfilePermissionsLoaded state;

  @override
  State<_ListSection> createState() => _ListSectionState();
}

class _ListSectionState extends State<_ListSection> {
  late final TextEditingController _searchController;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController(text: widget.state.filterQuery);
  }

  @override
  void didUpdateWidget(covariant _ListSection oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.state.filterQuery != _searchController.text) {
      _searchController.text = widget.state.filterQuery;
      _searchController.selection = TextSelection.fromPosition(
        TextPosition(offset: _searchController.text.length),
      );
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filteredPermissions = widget.state.filteredPermissions;
    final isFiltered = widget.state.filterQuery.isNotEmpty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.admin_panel_settings_outlined,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    context.t.profile.permissions.total(
                      count: widget.state.totalCount,
                    ),
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (isFiltered) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.secondaryContainer,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        context.t.profile.permissions.filtered(
                          count: filteredPermissions.length,
                        ),
                        style: Theme.of(context).textTheme.labelLarge?.copyWith(
                          color: Theme.of(
                            context,
                          ).colorScheme.onSecondaryContainer,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _searchController,
                onChanged: (value) {
                  context.read<CubitProfilePermissions>().filterPermissions(
                    value,
                  );
                },
                decoration: InputDecoration(
                  hintText: context.t.profile.permissions.searchHint,
                  prefixIcon: const Icon(Icons.search),
                  suffixIcon: isFiltered
                      ? IconButton(
                          tooltip: context.t.common.clear,
                          icon: const Icon(Icons.clear),
                          onPressed: () {
                            _searchController.clear();
                            context
                                .read<CubitProfilePermissions>()
                                .filterPermissions('');
                          },
                        )
                      : null,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(
                      color: Theme.of(context).colorScheme.outlineVariant,
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(
                      color: Theme.of(context).colorScheme.primary,
                      width: 2,
                    ),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
              ),
            ],
          ),
        ),
        if (filteredPermissions.isEmpty)
          Expanded(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  isFiltered
                      ? context.t.profile.permissions.noResults
                      : context.t.profile.permissions.empty,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontStyle: FontStyle.italic,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
              ),
            ),
          )
        else
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 8,
              ),
              itemCount: filteredPermissions.length,
              itemBuilder: (context, index) => _PermissionEntry(
                permission: filteredPermissions[index],
              ),
            ),
          ),
      ],
    );
  }
}

class _PermissionEntry extends StatelessWidget {
  const _PermissionEntry({required this.permission});

  final PermissionResponse permission;

  @override
  Widget build(BuildContext context) {
    final action = permission.action?.value ?? '-';
    final targetType = permission.targetType?.value ?? '-';
    final targetId = permission.targetId;

    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: Theme.of(context).colorScheme.outlineVariant,
        ),
      ),
      child: Theme(
        data: Theme.of(context).copyWith(
          dividerColor: Colors.transparent,
        ),
        child: ExpansionTile(
          shape: const Border(),
          collapsedShape: const Border(),
          tilePadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 4,
          ),
          leading: CircleAvatar(
            backgroundColor: Theme.of(context).colorScheme.secondaryContainer,
            child: Icon(
              Icons.security,
              color: Theme.of(context).colorScheme.onSecondaryContainer,
            ),
          ),
          title: Text(
            action,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
          expandedAlignment: Alignment.topLeft,
          childrenPadding: const EdgeInsets.only(
            left: 72,
            right: 16,
            bottom: 16,
          ),
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  context.t.profile.permissions.target(targetType: targetType),
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
                if (targetId != null && targetId.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    context.t.profile.permissions.id(targetId: targetId),
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}
