import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_resource/api.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_counts.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class StockCountEntrySheet extends StatefulWidget {
  const StockCountEntrySheet({
    required this.count,
    required this.shopId,
    super.key,
  });

  final StockCountDTO count;
  final String shopId;

  @override
  State<StockCountEntrySheet> createState() => _StockCountEntrySheetState();
}

class _StockCountEntrySheetState extends State<StockCountEntrySheet> {
  final Map<String, TextEditingController> _qtyControllers = {};
  final Map<String, TextEditingController> _notesControllers = {};
  bool _loading = false;

  List<StockCountItemDTO> get _items => widget.count.items;

  @override
  void initState() {
    super.initState();
    for (final item in _items) {
      final id = item.id ?? '';
      _qtyControllers[id] = TextEditingController(
        text: item.actualQuantity?.toString() ?? '0',
      );
      _notesControllers[id] = TextEditingController(
        text: item.notes ?? '',
      );
    }
  }

  @override
  void dispose() {
    for (final c in _qtyControllers.values) {
      c.dispose();
    }
    for (final c in _notesControllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() => _loading = true);
    try {
      final itemsPayload = _items.map((item) {
        final id = item.id ?? '';
        return <String, Object>{
          'stockCountItemId': id,
          'actualQuantity':
              double.tryParse(_qtyControllers[id]?.text ?? '0') ?? 0,
          if ((_notesControllers[id]?.text ?? '').isNotEmpty)
            'notes': _notesControllers[id]!.text.trim(),
        };
      }).toList();

      await context.read<CubitStockCounts>().submitCountEntries(
        id: widget.count.id!,
        shopId: widget.shopId,
        items: itemsPayload,
      );
      if (mounted) Navigator.of(context).pop();
    } on Object {
      // Error surfaced by CubitError
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t.stock;

    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.9,
      maxChildSize: 0.98,
      builder: (context, scrollController) {
        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.outlineVariant,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    t.count.enterCount,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const Spacer(),
                  FilledButton(
                    onPressed: _loading ? null : _submit,
                    child: _loading
                        ? const SizedBox.square(
                            dimension: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : Text(context.t.common.save),
                  ),
                ],
              ),
            ),
            // Table header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: Text(
                      t.resource.form.name,
                      style: Theme.of(context).textTheme.labelSmall,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      t.count.expected,
                      style: Theme.of(context).textTheme.labelSmall,
                      textAlign: TextAlign.center,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      t.count.actual,
                      style: Theme.of(context).textTheme.labelSmall,
                      textAlign: TextAlign.center,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      t.count.difference,
                      style: Theme.of(context).textTheme.labelSmall,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              ),
            ),
            const Divider(),
            Expanded(
              child: ListView.separated(
                controller: scrollController,
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 80),
                itemCount: _items.length,
                separatorBuilder: (_, _) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final item = _items[index];
                  final id = item.id ?? '';
                  final qtyCtrl = _qtyControllers[id]!;

                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Row(
                      children: [
                        Expanded(
                          flex: 3,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.stockResourceName ?? '',
                                style: Theme.of(context).textTheme.bodySmall
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                              if (item.notes?.isNotEmpty ?? false)
                                Text(
                                  item.notes!,
                                  style: Theme.of(context).textTheme.labelSmall
                                      ?.copyWith(
                                        color: Theme.of(
                                          context,
                                        ).colorScheme.onSurfaceVariant,
                                      ),
                                ),
                            ],
                          ),
                        ),
                        Expanded(
                          child: Text(
                            _fmtQty(item.expectedQuantity),
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ),
                        Expanded(
                          child: TextFormField(
                            controller: qtyCtrl,
                            decoration: const InputDecoration(
                              isDense: true,
                              border: OutlineInputBorder(),
                              contentPadding: EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 6,
                              ),
                            ),
                            keyboardType: const TextInputType.numberWithOptions(
                              decimal: true,
                            ),
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.bodySmall,
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                        Expanded(
                          child: AnimatedBuilder(
                            animation: qtyCtrl,
                            builder: (context, _) {
                              final actual = double.tryParse(qtyCtrl.text) ?? 0;
                              final expected =
                                  item.expectedQuantity?.toDouble() ?? 0;
                              final diff = actual - expected;
                              final color = diff < 0
                                  ? Colors.red
                                  : diff > 0
                                  ? Colors.green
                                  : null;
                              return Text(
                                (diff >= 0 ? '+' : '') + _fmtQty(diff),
                                textAlign: TextAlign.center,
                                style: Theme.of(context).textTheme.bodySmall
                                    ?.copyWith(
                                      color: color,
                                      fontWeight: FontWeight.bold,
                                    ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }

  static String _fmtQty(num? value) {
    if (value == null) return '-';
    final d = value.toDouble();
    if (d == d.truncateToDouble()) return d.toStringAsFixed(0);
    return d.toStringAsFixed(2);
  }
}
