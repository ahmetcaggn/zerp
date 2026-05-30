import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_resource/api.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_counts.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class StockCountFormSheet extends StatefulWidget {
  const StockCountFormSheet({
    required this.shopId,
    super.key,
  });

  final String shopId;

  @override
  State<StockCountFormSheet> createState() => _StockCountFormSheetState();
}

class _StockCountFormSheetState extends State<StockCountFormSheet> {
  final _formKey = GlobalKey<FormState>();
  final _notesCtrl = TextEditingController();
  DateTime _countDate = DateTime.now();
  bool _loading = false;

  @override
  void dispose() {
    _notesCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _countDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null) setState(() => _countDate = picked);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    try {
      await context.read<CubitStockCounts>().createCount(
        shopId: widget.shopId,
        dto: StockCountCreateDTO(
          shopId: widget.shopId,
          countDate: _countDate,
          notes: _notesCtrl.text.trim().isEmpty ? null : _notesCtrl.text.trim(),
        ),
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

    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(context).bottom),
      child: DraggableScrollableSheet(
        expand: false,
        maxChildSize: 0.8,
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
                t.count.createButton,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 20),
              OutlinedButton.icon(
                onPressed: _pickDate,
                icon: const Icon(Icons.calendar_today_outlined, size: 18),
                label: Text(
                  '${t.count.countDate}: '
                  '${_countDate.toLocal().toString().split(' ')[0]}',
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _notesCtrl,
                decoration: InputDecoration(
                  labelText: t.count.notes,
                  border: const OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 24),
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
