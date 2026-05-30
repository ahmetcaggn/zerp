import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_resource/api.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_operations.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_resources.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class _EntryItem {
  _EntryItem()
    : resourceCtrl = TextEditingController(),
      qtyCtrl = TextEditingController(),
      refCtrl = TextEditingController(),
      notesCtrl = TextEditingController();

  String? resourceId;
  final TextEditingController resourceCtrl;
  final TextEditingController qtyCtrl;
  final TextEditingController refCtrl;
  final TextEditingController notesCtrl;

  void dispose() {
    resourceCtrl.dispose();
    qtyCtrl.dispose();
    refCtrl.dispose();
    notesCtrl.dispose();
  }
}

class StockEntryFormSheet extends StatefulWidget {
  const StockEntryFormSheet({
    required this.shopId,
    super.key,
  });

  final String shopId;

  @override
  State<StockEntryFormSheet> createState() => _StockEntryFormSheetState();
}

class _StockEntryFormSheetState extends State<StockEntryFormSheet> {
  final _formKey = GlobalKey<FormState>();
  final _refCtrl = TextEditingController();
  final _notesCtrl = TextEditingController();
  final _items = <_EntryItem>[_EntryItem()];
  bool _loading = false;

  @override
  void dispose() {
    _refCtrl.dispose();
    _notesCtrl.dispose();
    for (final item in _items) {
      item.dispose();
    }
    super.dispose();
  }

  Future<void> _submit() async {
    final context = this.context;
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    try {
      final dtoItems = _items
          .where((item) => item.resourceId != null)
          .map(
            (item) => StockEntryItemDTO(
              stockResourceId: item.resourceId,
              quantity: double.tryParse(item.qtyCtrl.text),
              referenceNo: item.refCtrl.text.trim().isEmpty
                  ? null
                  : item.refCtrl.text.trim(),
              notes: item.notesCtrl.text.trim().isEmpty
                  ? null
                  : item.notesCtrl.text.trim(),
            ),
          )
          .toList();

      await context.read<CubitStockOperations>().createEntry(
        shopId: widget.shopId,
        dto: StockEntryCreateDTO(
          shopId: widget.shopId,
          referenceNo: _refCtrl.text.trim().isEmpty
              ? null
              : _refCtrl.text.trim(),
          notes: _notesCtrl.text.trim().isEmpty ? null : _notesCtrl.text.trim(),
          items: dtoItems,
        ),
      );
      if (!context.mounted) return;
      await context.read<CubitStockResources>().load(shopId: widget.shopId);
      if (context.mounted) Navigator.of(context).pop();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t.stock;
    final resourceState = context.watch<CubitStockResources>().state;
    final resources = resourceState is StateStockResourcesLoaded
        ? resourceState.resources
        : <StockResourceDTO>[];

    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(context).bottom),
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.85,
        maxChildSize: 0.95,
        builder: (context, scrollController) => Form(
          key: _formKey,
          child: ListView(
            controller: scrollController,
            padding: const EdgeInsets.all(24),
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.outlineVariant,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Text(
                t.operation.entryButton,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _refCtrl,
                decoration: InputDecoration(
                  labelText: t.operation.referenceNoOperation,
                  helperText: t.operation.referenceNoOperationHelp,
                  border: const OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _notesCtrl,
                decoration: InputDecoration(
                  labelText: t.operation.notes,
                  border: const OutlineInputBorder(),
                ),
                maxLines: 2,
              ),
              const Divider(height: 32),
              ...List.generate(_items.length, (index) {
                final item = _items[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(
                        color: Theme.of(context).colorScheme.outlineVariant,
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Row(
                            children: [
                              Text(
                                '${t.operation.itemCount} ${index + 1}',
                                style: Theme.of(context).textTheme.labelLarge,
                              ),
                              const Spacer(),
                              if (_items.length > 1)
                                IconButton(
                                  icon: const Icon(
                                    Icons.delete_outline,
                                    size: 20,
                                  ),
                                  onPressed: () => setState(() {
                                    _items[index].dispose();
                                    _items.removeAt(index);
                                  }),
                                  tooltip: t.operation.removeItem,
                                ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          DropdownButtonFormField<String>(
                            initialValue: item.resourceId,
                            decoration: InputDecoration(
                              labelText: t.resource.form.name,
                              border: const OutlineInputBorder(),
                            ),
                            items: resources
                                .map(
                                  (r) => DropdownMenuItem(
                                    value: r.id,
                                    child: Text(r.name ?? r.id ?? ''),
                                  ),
                                )
                                .toList(),
                            onChanged: (v) =>
                                setState(() => item.resourceId = v),
                            validator: (v) =>
                                v == null ? context.t.common.required : null,
                          ),
                          const SizedBox(height: 8),
                          TextFormField(
                            controller: item.qtyCtrl,
                            decoration: InputDecoration(
                              labelText: t.operation.quantity,
                              border: const OutlineInputBorder(),
                            ),
                            keyboardType: const TextInputType.numberWithOptions(
                              decimal: true,
                            ),
                            validator: (v) {
                              final d = double.tryParse(v ?? '');
                              if (d == null || d <= 0) {
                                return context.t.common.required;
                              }
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
              OutlinedButton.icon(
                onPressed: () => setState(() => _items.add(_EntryItem())),
                icon: const Icon(Icons.add, size: 18),
                label: Text(t.operation.addItem),
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: _loading ? null : _submit,
                child: _loading
                    ? const SizedBox.square(
                        dimension: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Text(context.t.common.save),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
