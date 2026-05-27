import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_sale/api.dart';
import 'package:zerp_tenant/feature/sale/cash/cubit/cubit_cash_payment.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenCashPayment extends StatelessWidget {
  const ScreenCashPayment({
    required this.orders,
    required this.selectedQtys,
    super.key,
  });

  final List<TableOrderDTO> orders;
  final Map<String, int> selectedQtys;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<CubitCashPayment>(),
      child: _View(orders: orders, selectedQtys: selectedQtys),
    );
  }
}

class _View extends StatefulWidget {
  const _View({required this.orders, required this.selectedQtys});

  final List<TableOrderDTO> orders;
  final Map<String, int> selectedQtys;

  @override
  State<_View> createState() => _ViewState();
}

class _ViewState extends State<_View> {
  bool _splitMode = false;
  final List<double> _splitPayments = [];
  final TextEditingController _splitController = TextEditingController();

  @override
  void dispose() {
    _splitController.dispose();
    super.dispose();
  }

  Future<void> _addSplitPayment(double grandTotal) async {
    final val = double.tryParse(_splitController.text);
    if (val != null && val > 0) {
      setState(() {
        _splitPayments.add(val);
        _splitController.clear();
      });
      final paidSoFar = _splitPayments.fold<double>(0, (a, b) => a + b);
      if (paidSoFar >= grandTotal - 0.001) {
        await _executePayment();
      }
    }
  }

  Future<void> _executePayment() async {
    await context.read<CubitCashPayment>().executePayment(
      orders: widget.orders,
      selectedQtys: widget.selectedQtys,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // Calculate payment plan for display
    final paymentPlan = <_DisplayPlanItem>[];
    var grandTotal = 0.0;

    for (final order in widget.orders) {
      final selectedItems = <_DisplayItem>[];
      var orderTotal = 0.0;
      var isFullOrder = true;

      for (final item in order.items) {
        final itemId = item.id;
        final maxQty = item.quantity ?? 1;
        final selectedQty =
            (itemId != null && widget.selectedQtys.containsKey(itemId))
            ? widget.selectedQtys[itemId]!
            : 0;

        if (selectedQty < maxQty) isFullOrder = false;

        if (selectedQty > 0) {
          var baseUnitPrice = item.unitPrice?.toDouble() ?? 0.0;
          for (final opt in item.selectedExtraOptions) {
            baseUnitPrice += opt.price?.toDouble() ?? 0.0;
          }
          final lineTotal = baseUnitPrice * selectedQty;
          orderTotal += lineTotal;
          selectedItems.add(
            _DisplayItem(
              name: item.menuItemName ?? '',
              qty: selectedQty,
              lineTotal: lineTotal,
            ),
          );
        }
      }

      if (selectedItems.isNotEmpty) {
        grandTotal += orderTotal;
        paymentPlan.add(
          _DisplayPlanItem(
            orderId: order.id ?? '',
            isFullOrder: isFullOrder,
            selectedItems: selectedItems,
          ),
        );
      }
    }

    final paidSoFar = _splitPayments.fold<double>(0, (a, b) => a + b);
    final remaining = (grandTotal - paidSoFar).clamp(0.0, double.infinity);

    return BlocListener<CubitCashPayment, StateCashPayment>(
      listener: (context, state) {
        if (state is StateCashPaymentSuccess) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(context.t.sale.cash.paymentReceivedToast)),
          );
          // Navigate back twice (to Tables view or Sale dashboard)
          unawaited(
            context.router.maybePopTop().then((_) async {
              if (!context.mounted) return;
              await context.router.maybePopTop();
            }),
          );
        } else if (state is StateCashPaymentError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: theme.colorScheme.error,
            ),
          );
        }
      },
      child: AppScaffold(
        title: context.t.sale.cash.title,
        body: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  ...paymentPlan.asMap().entries.map((entry) {
                    final index = entry.key;
                    final plan = entry.value;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                context.t.sale.cash.orderNumber(n: index + 1),
                                style: theme.textTheme.labelSmall?.copyWith(
                                  letterSpacing: 1,
                                  color: theme.colorScheme.onSurfaceVariant,
                                ),
                              ),
                              if (!plan.isFullOrder) ...[
                                const SizedBox(width: 8),
                                Chip(
                                  label: Text(context.t.sale.cash.partial),
                                  padding: EdgeInsets.zero,
                                  visualDensity: VisualDensity.compact,
                                  labelStyle: const TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ],
                          ),
                          const SizedBox(height: 8),
                          ...plan.selectedItems.map(
                            (item) => Padding(
                              padding: const EdgeInsets.symmetric(vertical: 4),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('${item.qty}× ${item.name}'),
                                  Text(
                                    '${item.lineTotal.toStringAsFixed(2)} ₺',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const Divider(),
                        ],
                      ),
                    );
                  }),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        context.t.sale.cash.total,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '${grandTotal.toStringAsFixed(2)} ₺',
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w900,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  Row(
                    children: [
                      Expanded(
                        child: FilledButton.icon(
                          onPressed: () {
                            setState(() {
                              _splitMode = false;
                              _splitPayments.clear();
                              _splitController.clear();
                            });
                          },
                          icon: const Icon(Icons.money),
                          label: Text(context.t.sale.cash.paymentMethodCash),
                          style: _splitMode
                              ? FilledButton.styleFrom(
                                  backgroundColor:
                                      theme.colorScheme.surfaceContainerHighest,
                                  foregroundColor: theme.colorScheme.onSurface,
                                )
                              : FilledButton.styleFrom(
                                  backgroundColor: Colors.green,
                                ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: null, // Coming soon
                          icon: const Icon(Icons.credit_card),
                          label: Text(context.t.sale.cash.paymentMethodCard),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Center(
                    child: TextButton(
                      onPressed: () {
                        setState(() {
                          _splitMode = !_splitMode;
                          _splitPayments.clear();
                          _splitController.clear();
                        });
                      },
                      child: Text(
                        context.t.sale.cash.payModeAmount,
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                    ),
                  ),
                  if (_splitMode) ...[
                    const SizedBox(height: 16),
                    if (_splitPayments.isNotEmpty) ...[
                      ..._splitPayments.asMap().entries.map(
                        (entry) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '+ ${entry.value.toStringAsFixed(2)} ₺',
                                style: const TextStyle(
                                  color: Colors.green,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              IconButton(
                                icon: const Icon(
                                  Icons.delete_outline,
                                  size: 20,
                                ),
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
                                onPressed: () {
                                  setState(() {
                                    _splitPayments.removeAt(entry.key);
                                  });
                                },
                              ),
                            ],
                          ),
                        ),
                      ),
                      const Divider(),
                    ],
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${context.t.sale.cash.paidSoFar}: '
                          '${paidSoFar.toStringAsFixed(2)} ₺',
                          style: const TextStyle(color: Colors.grey),
                        ),
                        Text(
                          '${context.t.sale.cash.remaining}: '
                          '${remaining.toStringAsFixed(2)} ₺',
                          style: TextStyle(
                            color: remaining > 0 ? Colors.red : Colors.green,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _splitController,
                            keyboardType: const TextInputType.numberWithOptions(
                              decimal: true,
                            ),
                            decoration: const InputDecoration(
                              isDense: true,
                              hintText: '0.00',
                              suffixText: '₺',
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        OutlinedButton(
                          onPressed: () => _addSplitPayment(grandTotal),
                          child: Text(
                            context.t.sale.cash.recordPayment,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            BlocBuilder<CubitCashPayment, StateCashPayment>(
              builder: (context, state) {
                final isPending = state is StateCashPaymentLoading;
                final canPay = !_splitMode || remaining <= 0.001;
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 10,
                        offset: const Offset(0, -5),
                      ),
                    ],
                  ),
                  child: SafeArea(
                    top: false,
                    child: SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: FilledButton.icon(
                        onPressed: (!isPending && canPay)
                            ? _executePayment
                            : null,
                        icon: isPending
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Icon(Icons.payment),
                        label: Text(
                          isPending
                              ? '...'
                              : (_splitMode
                                    ? context.t.sale.cash.completePayment
                                    : '${context.t.sale.cash.payBtn} '
                                          '${grandTotal.toStringAsFixed(2)} ₺'),
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        style: FilledButton.styleFrom(
                          backgroundColor: Colors.green,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _DisplayPlanItem {
  _DisplayPlanItem({
    required this.orderId,
    required this.isFullOrder,
    required this.selectedItems,
  });

  final String orderId;
  final bool isFullOrder;
  final List<_DisplayItem> selectedItems;
}

class _DisplayItem {
  _DisplayItem({
    required this.name,
    required this.qty,
    required this.lineTotal,
  });

  final String name;
  final int qty;
  final double lineTotal;
}
