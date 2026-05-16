import 'dart:async';

import 'package:flutter/material.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/employee/single_employee/permissions/create_permission/view/widget_permittable_tile.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class ViewPermittableListSelector extends StatefulWidget {
  const ViewPermittableListSelector({
    required this.targetType,
    required this.onSelected,
    this.parentId,
    super.key,
  });

  final PermissionTargetTypeEnum targetType;
  final String? parentId;
  final ValueChanged<PermittableResponseDTO> onSelected;

  @override
  State<ViewPermittableListSelector> createState() =>
      _ViewPermittableListSelectorState();
}

class _ViewPermittableListSelectorState
    extends State<ViewPermittableListSelector> {
  final TextEditingController searchController = TextEditingController();
  List<PermittableResponseDTO>? allItems;
  List<PermittableResponseDTO>? filteredItems;
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    unawaited(_loadItems());
    searchController.addListener(_filterItems);
  }

  Future<void> _loadItems() async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      final items = await getIt<PermissionService>().getPermittableList(
        targetType: widget.targetType,
        parentId: widget.parentId,
      );
      if (mounted) {
        setState(() {
          allItems = items;
          filteredItems = items;
          isLoading = false;
        });
      }
    } on Object catch (e) {
      if (mounted) {
        setState(() {
          error = e.toString();
          isLoading = false;
        });
      }
    }
  }

  void _filterItems() {
    final query = searchController.text.toLowerCase();
    setState(() {
      filteredItems = allItems?.where((item) {
        final title = item.title?.toLowerCase() ?? '';
        final id = item.id?.toLowerCase() ?? '';
        return title.contains(query) || id.contains(query);
      }).toList();
    });
  }

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 8),
        Container(
          width: 40,
          height: 4,
          decoration: BoxDecoration(
            color: Colors.grey[300],
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: TextField(
            controller: searchController,
            autofocus: true,
            decoration: InputDecoration(
              hintText: context.t.common.search,
              prefixIcon: const Icon(Icons.search),
              border: const OutlineInputBorder(),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Expanded(
          child: _buildContent(),
        ),
      ],
    );
  }

  Widget _buildContent() {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (error != null) {
      return Center(child: Text(error!));
    }

    if (filteredItems == null || filteredItems!.isEmpty) {
      return Center(child: Text(context.t.common.noData));
    }

    return ListView.builder(
      itemCount: filteredItems!.length,
      itemBuilder: (context, index) {
        final item = filteredItems![index];
        return WidgetPermittableTile(
          permittable: item,
          onTap: () => widget.onSelected(item),
        );
      },
    );
  }
}
