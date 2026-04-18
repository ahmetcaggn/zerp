import 'package:flutter/material.dart' hide RouteSettings;

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
                  'Zerp Tenant',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Menu',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard),
            title: const Text('Dashboard'),
            selected: activeIndex == 0,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(0),
          ),
          ListTile(
            leading: const Icon(Icons.people),
            title: const Text('Employees'),
            selected: activeIndex == 1,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(1),
          ),
          ListTile(
            leading: const Icon(Icons.restaurant_menu),
            title: const Text('Menu'),
            selected: activeIndex == 2,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(2),
          ),
          ListTile(
            leading: const Icon(Icons.shopping_cart),
            title: const Text('Sales'),
            selected: activeIndex == 3,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(3),
          ),
          ListTile(
            leading: const Icon(Icons.inventory),
            title: const Text('Stock'),
            selected: activeIndex == 4,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(4),
          ),
          ListTile(
            leading: const Icon(Icons.store),
            title: const Text('Store'),
            selected: activeIndex == 5,
            selectedTileColor: Theme.of(context).colorScheme.primaryContainer,
            onTap: () => onSelectSection(5),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Settings'),
            onTap: onTapSettings,
          ),
        ],
      ),
    );
  }
}
