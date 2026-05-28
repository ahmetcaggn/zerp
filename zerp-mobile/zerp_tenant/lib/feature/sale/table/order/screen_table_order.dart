import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_sale/api.dart';
import 'package:zerp_tenant/feature/sale/table/cubit/cubit_tables.dart';
import 'package:zerp_tenant/feature/sale/table/order/cubit/cubit_table_order.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/cancel_order_confirm_dialog.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/discard_changes_confirm_dialog.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/import_code_dialog.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/order_item_list.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenTableOrder extends StatelessWidget {
  const ScreenTableOrder({
    required this.tableId,
    required this.tableName,
    required this.cubitTables,
    super.key,
  });

  final String tableId;
  final String tableName;
  final CubitTables cubitTables;

  @override
  Widget build(BuildContext context) {
    return PopScope(
      onPopInvokedWithResult: (_, _) async {
        await cubitTables.refreshTable(tableId);
      },
      child: BlocProvider(
        create: (_) {
          final cubit = getIt<CubitTableOrder>();
          unawaited(cubit.init(tableId: tableId));
          return cubit;
        },
        child: _View(tableId: tableId, tableName: tableName),
      ),
    );
  }
}

class _View extends StatefulWidget {
  const _View({
    required this.tableId,
    required this.tableName,
  });

  final String tableId;
  final String tableName;

  @override
  State<_View> createState() => _ViewState();
}

class _ViewState extends State<_View> {
  final TextEditingController _noteController = TextEditingController();
  bool _forcePop = false;

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<CubitTableOrder, StateTableOrder>(
      listener: (context, state) {
        if (state is StateTableOrderLoaded) {
          final currentNote = state.currentOrder.note ?? '';
          if (_noteController.text != currentNote) {
            _noteController.text = currentNote;
          }
        }
      },
      builder: (context, state) {
        final hasChanges =
            state is StateTableOrderLoaded && state.hasUnsavedChanges;

        return PopScope(
          canPop: _forcePop || !hasChanges,
          onPopInvokedWithResult: (didPop, _) async {
            if (didPop) return;
            final confirm = await DiscardChangesConfirmDialog.show(context);
            if (confirm == true && context.mounted) {
              setState(() {
                _forcePop = true;
              });
              context.router.pop();
            }
          },
          child: AppScaffold(
            title: '${widget.tableName} - ${context.t.sale.order.title}',
            body: switch (state) {
              StateTableOrderInitial() ||
              StateTableOrderLoading() => const Center(
                child: CircularProgressIndicator(),
              ),
              StateTableOrderError() => _Error(
                tableId: widget.tableId,
                state: state,
              ),
              StateTableOrderLoaded() => _Loaded(
                tableId: widget.tableId,
                state: state,
                noteController: _noteController,
              ),
            },
          ),
        );
      },
    );
  }
}

final class _Error extends StatelessWidget {
  const _Error({
    required this.tableId,
    required this.state,
  });

  final String tableId;
  final StateTableOrderError state;

  @override
  Widget build(BuildContext context) {
    final message = state.message;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.error_outline,
            size: 48,
            color: Colors.red,
          ),
          const SizedBox(height: 16),
          Text(message, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => context.read<CubitTableOrder>().init(
              tableId: tableId,
            ),
            child: Text(context.t.common.retry),
          ),
        ],
      ),
    );
  }
}

final class _Loaded extends StatelessWidget {
  const _Loaded({
    required this.tableId,
    required this.state,
    required this.noteController,
  });

  final String tableId;
  final StateTableOrderLoaded state;
  final TextEditingController noteController;

  @override
  Widget build(BuildContext context) {
    final categories = state.categories;
    final menuItems = state.menuItems;
    final selectedCategoryId = state.selectedCategoryId;
    final isSaving = state.isSaving;
    final isImporting = state.isImporting;

    final currentOrder = state.currentOrder;
    final cartItems = currentOrder.cartItems;

    return Stack(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _OrderTabBar(state: state, tableId: tableId),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  _OrderHeader(
                    tableId: tableId,
                    currentOrder: currentOrder,
                  ),
                  const SizedBox(height: 16),
                  if (cartItems.isEmpty)
                    _emptyCartIndicator(context)
                  else
                    _OrderSection(
                      cartItems: cartItems,
                      noteController: noteController,
                    ),
                  const Divider(height: 32),
                  _CatalogSection(
                    categories: categories,
                    menuItems: menuItems,
                    selectedCategoryId: selectedCategoryId,
                  ),
                ],
              ),
            ),
            _BottomSection(
              tableId: tableId,
              cartItems: cartItems,
            ),
          ],
        ),
        if (isSaving || isImporting)
          const ColoredBox(
            color: Colors.black26,
            child: Center(
              child: CircularProgressIndicator(),
            ),
          ),
      ],
    );
  }

  Widget _emptyCartIndicator(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 32),
      child: Center(
        child: Text(
          context.t.sale.order.empty,
          style: const TextStyle(
            fontSize: 16,
            color: Colors.grey,
          ),
        ),
      ),
    );
  }
}

class _OrderTabBar extends StatelessWidget {
  const _OrderTabBar({required this.state, required this.tableId});

  final StateTableOrderLoaded state;
  final String tableId;

  Future<void> _scanQrForNewOrder(BuildContext context) async {
    final code = await ImportCodeDialog.show(context);
    if (code != null && code.isNotEmpty) {
      if (!context.mounted) return;
      final messenger = ScaffoldMessenger.of(context);
      final strings = context.t;
      final success = await context
          .read<CubitTableOrder>()
          .importFromCodeAsNewOrder(
            code: code,
            tableId: tableId,
          );
      if (context.mounted) {
        messenger.showSnackBar(
          SnackBar(
            content: Text(
              success
                  ? strings.sale.order.qrImportSuccess
                  : strings.sale.order.qrImportError,
            ),
            backgroundColor: success ? Colors.green : Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, 2),
            blurRadius: 4,
          ),
        ],
      ),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        itemCount: state.orders.length + 2, // Orders + QR Button + Add Button
        itemBuilder: (context, index) {
          if (index < state.orders.length) {
            final isSelected = index == state.selectedOrderIndex;
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ChoiceChip(
                label: Text(context.t.sale.order.orderTab(n: index + 1)),
                selected: isSelected,
                onSelected: (_) =>
                    context.read<CubitTableOrder>().selectOrder(index),
              ),
            );
          } else if (index == state.orders.length) {
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ActionChip(
                avatar: const Icon(Icons.qr_code_scanner, size: 18),
                label: Text(context.t.sale.order.newOrder),
                onPressed: state.hasUnsavedChanges
                    ? () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              context.t.sale.order.hasUnsavedOrders,
                            ),
                          ),
                        );
                      }
                    : () => _scanQrForNewOrder(context),
              ),
            );
          } else {
            return ActionChip(
              avatar: const Icon(Icons.add, size: 18),
              label: Text(context.t.sale.order.newOrder),
              onPressed: state.hasUnsavedChanges
                  ? () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            context.t.sale.order.hasUnsavedOrders,
                          ),
                        ),
                      );
                    }
                  : () => context.read<CubitTableOrder>().addNewOrder(),
            );
          }
        },
      ),
    );
  }
}

class _OrderHeader extends StatelessWidget {
  const _OrderHeader({
    required this.tableId,
    required this.currentOrder,
  });

  final String tableId;
  final OrderEntry currentOrder;

  Future<void> _scanQrToAppend(BuildContext context) async {
    final code = await ImportCodeDialog.show(context);
    if (code != null && code.isNotEmpty) {
      if (!context.mounted) return;
      final messenger = ScaffoldMessenger.of(context);
      final strings = context.t;
      final success = await context
          .read<CubitTableOrder>()
          .importFromCodeToCurrentOrder(
            code: code,
            tableId: tableId,
          );
      if (context.mounted) {
        messenger.showSnackBar(
          SnackBar(
            content: Text(
              success
                  ? strings.sale.order.qrImportSuccess
                  : strings.sale.order.qrImportError,
            ),
            backgroundColor: success ? Colors.green : Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _cancelCurrentOrder(BuildContext context) async {
    final confirm = await CancelOrderConfirmDialog.show(context);
    if (confirm == true) {
      if (!context.mounted) return;
      final messenger = ScaffoldMessenger.of(context);
      final cancelMsg = context.t.sale.order.orderCancelled;
      final success = await context.read<CubitTableOrder>().cancelOrder(
        tableId: tableId,
      );
      if (context.mounted && success) {
        messenger.showSnackBar(
          SnackBar(content: Text(cancelMsg)),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        IconButton(
          tooltip: context.t.sale.order.importOrder,
          icon: const Icon(Icons.qr_code_scanner),
          color: Theme.of(context).colorScheme.primary,
          onPressed: () => _scanQrToAppend(context),
        ),
        IconButton(
          tooltip: context.t.sale.order.cancelDialog.title,
          icon: const Icon(Icons.delete_outline),
          color: Colors.redAccent,
          onPressed: () => _cancelCurrentOrder(context),
        ),
      ],
    );
  }
}

final class _OrderSection extends StatelessWidget {
  const _OrderSection({
    required this.cartItems,
    required this.noteController,
  });

  final List<CartItem> cartItems;
  final TextEditingController noteController;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        OrderItemList(
          items: cartItems,
          onQuantityChanged: (menuItemId, delta) {
            context.read<CubitTableOrder>().updateCartItemQuantity(
              menuItemId,
              delta,
            );
          },
        ),
        const SizedBox(height: 16),
        TextField(
          controller: noteController,
          decoration: InputDecoration(
            labelText: context.t.sale.order.orderNotes,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(
                12,
              ),
            ),
          ),
          maxLines: 2,
          onChanged: (note) {
            context.read<CubitTableOrder>().updateOrderNote(note);
          },
        ),
      ],
    );
  }
}

final class _CatalogSection extends StatelessWidget {
  const _CatalogSection({
    required this.categories,
    required this.menuItems,
    required this.selectedCategoryId,
  });

  final List<MenuCategoryDTO> categories;
  final List<MenuItemDTO> menuItems;
  final String? selectedCategoryId;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          context.t.sale.order.addProducts,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 40,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: categories.length + 1,
            itemBuilder: (context, index) {
              final isAll = index == 0;
              final category = isAll ? null : categories[index - 1];
              final isSelected = isAll
                  ? selectedCategoryId == null
                  : selectedCategoryId == category?.id;

              return Padding(
                padding: const EdgeInsets.only(
                  right: 8,
                ),
                child: ChoiceChip(
                  label: Text(
                    isAll
                        ? context.t.sale.order.categoryAll
                        : (category?.name ?? ''),
                  ),
                  selected: isSelected,
                  onSelected: (_) {
                    context.read<CubitTableOrder>().selectCategory(
                      isAll ? null : category?.id,
                    );
                  },
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 12),
        Builder(
          builder: (context) {
            final filteredItems = menuItems.where((item) {
              if (selectedCategoryId == null) return true;
              return item.categoryId == selectedCategoryId;
            }).toList();

            if (filteredItems.isEmpty) {
              return Padding(
                padding: const EdgeInsets.symmetric(
                  vertical: 24,
                ),
                child: Center(
                  child: Text(
                    context.t.sale.order.noProducts,
                  ),
                ),
              );
            }

            return GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                maxCrossAxisExtent: 192,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: filteredItems.length,
              itemBuilder: (context, index) {
                final item = filteredItems[index];
                return Card(
                  elevation: 1,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: BorderSide(
                      color: Theme.of(context).colorScheme.outlineVariant,
                    ),
                  ),
                  child: InkWell(
                    onTap: () {
                      context.read<CubitTableOrder>().addMenuItemToOrder(item);
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Padding(
                      padding: const EdgeInsets.all(8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            item.name ?? '',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '₺${(item.price ?? 0).toStringAsFixed(2)}',
                            style: TextStyle(
                              color: Theme.of(
                                context,
                              ).colorScheme.primary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            );
          },
        ),
      ],
    );
  }
}

final class _BottomSection extends StatelessWidget {
  const _BottomSection({
    required this.tableId,
    required this.cartItems,
  });

  final String tableId;
  final List<CartItem> cartItems;

  @override
  Widget build(BuildContext context) {
    final total = cartItems.fold<num>(0, (sum, item) => sum + item.totalPrice);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    context.t.sale.order.totalPrice,
                    style: const TextStyle(
                      color: Colors.grey,
                      fontSize: 12,
                    ),
                  ),
                  Text(
                    '₺${total.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 16),
            ElevatedButton(
              onPressed: cartItems.isEmpty
                  ? null
                  : () async {
                      final messenger = ScaffoldMessenger.of(
                        context,
                      );
                      final router = context.router;
                      final success = await context
                          .read<CubitTableOrder>()
                          .saveOrder(tableId: tableId);
                      if (context.mounted && success) {
                        messenger.showSnackBar(
                          SnackBar(
                            content: Text(
                              context.t.sale.order.orderSavedSuccess,
                            ),
                          ),
                        );
                        router.pop();
                      }
                    },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 16,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(
                    12,
                  ),
                ),
              ),
              child: Text(context.t.sale.order.save),
            ),
          ],
        ),
      ),
    );
  }
}
