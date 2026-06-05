import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/sale/table/cubit/cubit_tables.dart';
import 'package:zerp_tenant/feature/sale/table/order/cubit/cubit_table_order.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/catalog_section.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/discard_changes_confirm_dialog.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/order_header.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/order_section.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/order_tab_bar.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold_messenger.dart';
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
    final isSaving = state.isSaving;
    final isImporting = state.isImporting;

    final currentOrder = state.currentOrder;
    final cartItems = currentOrder.cartItems;

    return Stack(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            OrderTabBar(state: state, tableId: tableId),
            Expanded(
              child: _Content(
                tableId: tableId,
                state: state,
                noteController: noteController,
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
}

final class _Content extends StatelessWidget {
  const _Content({
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

    final currentOrder = state.currentOrder;
    final cartItems = currentOrder.cartItems;
    return LayoutBuilder(
      builder: (context, constraints) {
        // two column
        if (constraints.maxWidth > 720) {
          return Row(
            children: [
              Expanded(
                child: CatalogSection(
                  categories: categories,
                  menuItems: menuItems,
                  extraOptions: state.extraOptions,
                  selectedCategoryId: selectedCategoryId,
                  scrollable: true,
                  isCatalogLoading: state.isCatalogLoading,
                ),
              ),
              Container(
                width: 1,
                color: Colors.grey.withValues(alpha: 0.2),
              ),
              SizedBox(
                width: 360,
                child: MediaQuery.removePadding(
                  context: context,
                  removeTop: true,
                  child: ListView(
                    children: [
                      const SizedBox(height: 8),
                      OrderHeader(
                        tableId: tableId,
                        currentOrder: currentOrder,
                      ),
                      if (cartItems.isEmpty)
                        _emptyCartIndicator(context)
                      else
                        OrderSection(
                          cartItems: cartItems,
                          noteController: noteController,
                        ),
                    ],
                  ),
                ),
              ),
            ],
          );
        }

        // single column
        return MediaQuery.removePadding(
          context: context,
          removeTop: true,
          child: ListView(
            children: [
              const SizedBox(height: 8),
              CatalogSection(
                categories: categories,
                menuItems: menuItems,
                extraOptions: state.extraOptions,
                selectedCategoryId: selectedCategoryId,
                scrollable: false,
                isCatalogLoading: state.isCatalogLoading,
              ),
              const Divider(height: 16),
              OrderHeader(
                tableId: tableId,
                currentOrder: currentOrder,
              ),
              if (cartItems.isEmpty)
                _emptyCartIndicator(context)
              else
                OrderSection(
                  cartItems: cartItems,
                  noteController: noteController,
                ),
            ],
          ),
        );
      },
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
        top: false,
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
                      final messenger = AppScaffoldMessenger.of(context);
                      final router = context.router;
                      final success = await context
                          .read<CubitTableOrder>()
                          .saveOrder(tableId: tableId);
                      if (context.mounted && success) {
                        messenger.showSuccess(
                          context.t.sale.order.orderSavedSuccess,
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
