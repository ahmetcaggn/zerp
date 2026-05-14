import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class ViewCreatePermissionActionSelector extends StatefulWidget {
  const ViewCreatePermissionActionSelector({
    required this.actions,
    required this.onSelected,
    this.initialAction,
    super.key,
  });

  final List<String> actions;
  final ValueChanged<String> onSelected;
  final String? initialAction;

  @override
  State<ViewCreatePermissionActionSelector> createState() =>
      _ViewCreatePermissionActionSelectorState();
}

class _ViewCreatePermissionActionSelectorState
    extends State<ViewCreatePermissionActionSelector> {
  late List<String> filteredActions;
  final TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    filteredActions = widget.actions;
    searchController.addListener(_filterActions);
  }

  void _filterActions() {
    setState(() {
      filteredActions = widget.actions
          .where(
            (action) => action.toLowerCase().contains(
              searchController.text.toLowerCase(),
            ),
          )
          .toList();
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
              hintText:
                  context.t.employee.details.permissionCreate.searchActions,
              prefixIcon: const Icon(Icons.search),
              border: const OutlineInputBorder(),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Expanded(
          child: ListView.builder(
            itemCount: filteredActions.length,
            itemBuilder: (context, index) {
              final action = filteredActions[index];
              return ListTile(
                title: Text(action),
                trailing: action == widget.initialAction
                    ? const Icon(Icons.check, color: Colors.green)
                    : null,
                onTap: () {
                  widget.onSelected(action);
                  Navigator.pop(context);
                },
                selected: action == widget.initialAction,
              );
            },
          ),
        ),
      ],
    );
  }
}
