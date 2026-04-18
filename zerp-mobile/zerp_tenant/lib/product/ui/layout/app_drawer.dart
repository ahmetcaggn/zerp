import 'package:flutter/material.dart' hide RouteSettings;
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({
    required this.activeIndex,
    required this.onSelectSection,
    required this.onTapSettings,
    super.key,
  });

  final int activeIndex;
  final ValueChanged<int> onSelectSection;
  final VoidCallback onTapSettings;

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: Theme.of(context).primaryColor),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  context.t.app.name,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  context.t.app.menu,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard),
            title: Text(context.t.shell.dashboard),
            selected: activeIndex == 0,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(0),
          ),
          ListTile(
            leading: const Icon(Icons.people),
            title: Text(context.t.shell.employees),
            selected: activeIndex == 1,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(1),
          ),
          ListTile(
            leading: const Icon(Icons.restaurant_menu),
            title: Text(context.t.shell.menu),
            selected: activeIndex == 2,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(2),
          ),
          ListTile(
            leading: const Icon(Icons.shopping_cart),
            title: Text(context.t.shell.sales),
            selected: activeIndex == 3,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(3),
          ),
          ListTile(
            leading: const Icon(Icons.inventory),
            title: Text(context.t.shell.stock),
            selected: activeIndex == 4,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(4),
          ),
          ListTile(
            leading: const Icon(Icons.store),
            title: Text(context.t.shell.store),
            selected: activeIndex == 5,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(5),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.settings),
            title: Text(context.t.shell.settings),
            onTap: onTapSettings,
          ),
        ],
      ),
    );
  }
}
