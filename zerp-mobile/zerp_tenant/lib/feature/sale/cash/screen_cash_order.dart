import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_sale/api.dart';
import 'package:zerp_tenant/feature/sale/cash/cubit/cubit_cash_order.dart';
import 'package:zerp_tenant/feature/sale/cash/cubit/cubit_cash_tables.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenCashOrder extends StatelessWidget {
  const ScreenCashOrder({
    required this.tableId,
    required this.tableName,
    required this.cubitCashTables,
    super.key,
  });

  final String tableId;
  final String tableName;
  final CubitCashTables cubitCashTables;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt<CubitCashOrder>();
        unawaited(cubit.init(tableId));
        return cubit;
      },
      child: _View(
        tableName: tableName,
        tableId: tableId,
        cubitCashTables: cubitCashTables,
      ),
    );
  }
}

class _View extends StatelessWidget {
  const _View({
    required this.tableName,
    required this.tableId,
    required this.cubitCashTables,
  });

  final String tableName;
  final String tableId;
  final CubitCashTables cubitCashTables;

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: '$tableName - ${context.t.sale.cash.title}',
      body: BlocBuilder<CubitCashOrder, StateCashOrder>(
        builder: (context, state) {
          switch (state) {
            case StateCashOrderInitial() || StateCashOrderLoading():
              return const Center(child: CircularProgressIndicator());
            case StateCashOrderError():
              return _Error(state: state, tableId: tableId);
            case StateCashOrderLoaded():
              return _Loaded(
                state: state,
                tableName: tableName,
                tableId: tableId,
                cubitCashTables: cubitCashTables,
              );
          }
        },
      ),
    );
  }
}

class _Error extends StatelessWidget {
  const _Error({required this.state, required this.tableId});

  final StateCashOrderError state;
  final String tableId;

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
            onPressed: () => context.read<CubitCashOrder>().init(tableId),
            child: Text(context.t.sale.cash.retry),
          ),
        ],
      ),
    );
  }
}

class _Loaded extends StatelessWidget {
  const _Loaded({
    required this.state,
    required this.tableName,
    required this.tableId,
    required this.cubitCashTables,
  });

  final StateCashOrderLoaded state;
  final String tableName;
  final String tableId;
  final CubitCashTables cubitCashTables;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final orders = state.orders;
    final selectedQtys = state.selectedQtys;

    if (orders.isEmpty) {
      return Center(
        child: Text(context.t.sale.cash.noOpenOrders),
      );
    }

    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: orders.length,
            itemBuilder: (context, index) {
              final order = orders[index];
              return _OrderAccordion(
                order: order,
                selectedQtys: selectedQtys,
                index: index,
              );
            },
          ),
        ),
        // Bottom sticky bar
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 10,
                offset: const Offset(0, -2),
              ),
            ],
          ),
          child: SafeArea(
            top: false,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Text(
                          '${context.t.sale.cash.select}: '
                          '${state.totalSelectedCount}',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                        const SizedBox(width: 8),
                        TextButton(
                          onPressed: state.isAllSelected
                              ? () => context.read<CubitCashOrder>().clearAll()
                              : () =>
                                    context.read<CubitCashOrder>().selectAll(),
                          style: TextButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 8),
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          child: Text(
                            state.isAllSelected
                                ? context.t.sale.cash.clearAll
                                : context.t.sale.cash.selectAll,
                          ),
                        ),
                      ],
                    ),
                    Text(
                      '${state.selectedTotal.toStringAsFixed(2)} ₺',
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: FilledButton.icon(
                    onPressed: state.totalSelectedCount > 0
                        ? () async {
                            await context.router.push(
                              RouteCashPayment(
                                orders: orders,
                                selectedQtys: selectedQtys,
                              ),
                            );
                            // Refresh orders for this table after returning
                            // from payment (payment may have been completed).
                            if (!context.mounted) return;
                            unawaited(
                              context
                                  .read<CubitCashOrder>()
                                  .init(tableId),
                            );
                            // Also refresh the table card in the tables list.
                            unawaited(
                              cubitCashTables.refreshTable(tableId),
                            );
                          }
                        : null,
                    icon: const Icon(Icons.shopping_cart_checkout),
                    label: Text(
                      context.t.sale.cash.recordPayment,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _OrderAccordion extends StatelessWidget {
  const _OrderAccordion({
    required this.order,
    required this.selectedQtys,
    required this.index,
  });

  final TableOrderDTO order;
  final Map<String, int> selectedQtys;
  final int index;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    double oTotal = 0;
    for (final item in order.items) {
      var unitPrice = item.unitPrice?.toDouble() ?? 0.0;
      for (final opt in item.selectedExtraOptions) {
        unitPrice += opt.price?.toDouble() ?? 0.0;
      }
      oTotal += unitPrice * (item.quantity ?? 1);
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: theme.colorScheme.outlineVariant),
      ),
      elevation: 0,
      clipBehavior: Clip.antiAlias,
      child: ExpansionTile(
        initiallyExpanded: true,
        title: Row(
          children: [
            Chip(
              label: Text(context.t.sale.cash.orderNumber(n: index + 1)),
              padding: EdgeInsets.zero,
              labelStyle: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
              color: WidgetStateProperty.all(
                theme.colorScheme.secondaryContainer,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                context.t.sale.cash.itemCount(n: order.items.length),
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ),
            Text(
              '${oTotal.toStringAsFixed(2)} ₺',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
        children: [
          if (order.note != null && order.note!.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  order.note!,
                  style: theme.textTheme.bodySmall?.copyWith(
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
            ),
          ...order.items.map(
            (item) => _ItemRow(item: item, selectedQtys: selectedQtys),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}

class _ItemRow extends StatelessWidget {
  const _ItemRow({required this.item, required this.selectedQtys});

  final TableOrderItemDTO item;
  final Map<String, int> selectedQtys;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final itemId = item.id ?? '';
    final maxQty = item.quantity ?? 1;
    final selectedQty = selectedQtys[itemId] ?? 0;

    var baseUnitPrice = item.unitPrice?.toDouble() ?? 0.0;
    for (final opt in item.selectedExtraOptions) {
      baseUnitPrice += opt.price?.toDouble() ?? 0.0;
    }
    final lineTotal = baseUnitPrice * maxQty;

    return Container(
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: theme.colorScheme.outlineVariant,
            width: 0.5,
          ),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Stepper(
            value: selectedQty,
            max: maxQty,
            onChanged: (val) {
              context.read<CubitCashOrder>().updateQty(itemId, val);
            },
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Expanded(
                      child: Text(
                        '${item.quantity}× ${item.menuItemName ?? ''}',
                        style: const TextStyle(fontWeight: FontWeight.w500),
                      ),
                    ),
                    Text(
                      '${baseUnitPrice.toStringAsFixed(2)} ₺',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                if (item.selectedExtraOptions.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  ...item.selectedExtraOptions.map(
                    (opt) => Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('+ ${opt.name}', style: theme.textTheme.bodySmall),
                        Text(
                          '${opt.price?.toStringAsFixed(2)} ₺',
                          style: theme.textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                ],
                if (maxQty > 1 || item.selectedExtraOptions.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.only(top: 4),
                    decoration: BoxDecoration(
                      border: Border(
                        top: BorderSide(
                          color: theme.colorScheme.outlineVariant,
                        ),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          context.t.sale.cash.total,
                          style: theme.textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '${lineTotal.toStringAsFixed(2)} ₺',
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                if (item.notes != null && item.notes!.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      item.notes!,
                      style: theme.textTheme.bodySmall?.copyWith(
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Stepper extends StatelessWidget {
  const _Stepper({
    required this.value,
    required this.max,
    required this.onChanged,
  });

  final int value;
  final int max;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          onPressed: value > 0 ? () => onChanged(value - 1) : null,
          icon: const Icon(Icons.remove, size: 16),
          visualDensity: VisualDensity.compact,
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
          style: IconButton.styleFrom(
            backgroundColor: theme.colorScheme.surfaceContainerHighest,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(6),
            ),
          ),
        ),
        SizedBox(
          width: 32,
          child: Text(
            '$value/$max',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: value > 0
                  ? theme.colorScheme.primary
                  : theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ),
        IconButton(
          onPressed: value < max ? () => onChanged(value + 1) : null,
          icon: const Icon(Icons.add, size: 16),
          visualDensity: VisualDensity.compact,
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
          style: IconButton.styleFrom(
            backgroundColor: theme.colorScheme.surfaceContainerHighest,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(6),
            ),
          ),
        ),
      ],
    );
  }
}
