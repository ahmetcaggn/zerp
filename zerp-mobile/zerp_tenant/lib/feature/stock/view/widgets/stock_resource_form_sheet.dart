import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_resource/api.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_resources.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class StockResourceFormSheet extends StatefulWidget {
  const StockResourceFormSheet({
    required this.shopId,
    this.initialData,
    super.key,
  });

  final String shopId;
  final StockResourceDTO? initialData;

  @override
  State<StockResourceFormSheet> createState() => _StockResourceFormSheetState();
}

class _StockResourceFormSheetState extends State<StockResourceFormSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameCtrl;
  late final TextEditingController _descCtrl;
  late final TextEditingController _qtyCtrl;
  late final TextEditingController _thresholdCtrl;
  late final TextEditingController _costCtrl;
  StockResourceCreateDTOUnitTypeEnum _unitType =
      StockResourceCreateDTOUnitTypeEnum.PIECE;
  bool _loading = false;

  bool get _isEditing => widget.initialData != null;

  @override
  void initState() {
    super.initState();
    final d = widget.initialData;
    _nameCtrl = TextEditingController(text: d?.name ?? '');
    _descCtrl = TextEditingController(text: d?.description ?? '');
    _qtyCtrl = TextEditingController(text: d?.quantity?.toString() ?? '0');
    _thresholdCtrl = TextEditingController(
      text: d?.reorderThreshold?.toString() ?? '0',
    );
    _costCtrl = TextEditingController(text: d?.costPerUnit?.toString() ?? '0');
    if (d?.unitType != null) {
      _unitType = StockResourceCreateDTOUnitTypeEnum.values.firstWhere(
        (e) => e.value == d!.unitType!.value,
        orElse: () => StockResourceCreateDTOUnitTypeEnum.PIECE,
      );
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _descCtrl.dispose();
    _qtyCtrl.dispose();
    _thresholdCtrl.dispose();
    _costCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    try {
      final cubit = context.read<CubitStockResources>();
      if (_isEditing) {
        await cubit.updateResource(
          id: widget.initialData!.id!,
          shopId: widget.shopId,
          dto: StockResourceUpdateDTO(
            name: _nameCtrl.text.trim(),
            description: _descCtrl.text.trim().isEmpty
                ? null
                : _descCtrl.text.trim(),
            reorderThreshold: double.tryParse(_thresholdCtrl.text),
            costPerUnit: double.tryParse(_costCtrl.text),
          ),
        );
      } else {
        await cubit.createResource(
          shopId: widget.shopId,
          dto: StockResourceCreateDTO(
            name: _nameCtrl.text.trim(),
            description: _descCtrl.text.trim().isEmpty
                ? null
                : _descCtrl.text.trim(),
            shopId: widget.shopId,
            unitType: _unitType,
            quantity: double.tryParse(_qtyCtrl.text) ?? 0,
            reorderThreshold: double.tryParse(_thresholdCtrl.text) ?? 0,
            costPerUnit: double.tryParse(_costCtrl.text) ?? 0,
          ),
        );
      }
      if (mounted) Navigator.of(context).pop();
    } on Object {
      // Error is already surfaced by CubitError
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t.stock;
    final title = _isEditing ? t.resource.editButton : t.resource.createButton;

    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(context).bottom),
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) => SingleChildScrollView(
          controller: scrollController,
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
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
                Text(title, style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 20),
                TextFormField(
                  controller: _nameCtrl,
                  decoration: InputDecoration(
                    labelText: t.resource.form.name,
                    border: const OutlineInputBorder(),
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty)
                      ? context.t.common.required
                      : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _descCtrl,
                  decoration: InputDecoration(
                    labelText: t.resource.form.description,
                    border: const OutlineInputBorder(),
                  ),
                  maxLines: 2,
                ),
                const SizedBox(height: 12),
                if (!_isEditing) ...[
                  DropdownButtonFormField<StockResourceCreateDTOUnitTypeEnum>(
                    initialValue: _unitType,
                    decoration: InputDecoration(
                      labelText: t.resource.form.unitType,
                      border: const OutlineInputBorder(),
                    ),
                    items: StockResourceCreateDTOUnitTypeEnum.values.map((e) {
                      return DropdownMenuItem(
                        value: e,
                        child: Text(
                          (context.t['stock.resource.unitTypes.${e.value}']
                                  as String?) ??
                              e.value,
                        ),
                      );
                    }).toList(),
                    onChanged: (v) => setState(() => _unitType = v!),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _qtyCtrl,
                    decoration: InputDecoration(
                      labelText: t.resource.form.quantity,
                      border: const OutlineInputBorder(),
                    ),
                    keyboardType: const TextInputType.numberWithOptions(
                      decimal: true,
                    ),
                    validator: (v) => double.tryParse(v ?? '') == null
                        ? context.t.common.required
                        : null,
                  ),
                  const SizedBox(height: 12),
                ],
                TextFormField(
                  controller: _thresholdCtrl,
                  decoration: InputDecoration(
                    labelText: t.resource.form.reorderThreshold,
                    border: const OutlineInputBorder(),
                  ),
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  validator: (v) => double.tryParse(v ?? '') == null
                      ? context.t.common.required
                      : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _costCtrl,
                  decoration: InputDecoration(
                    labelText: t.resource.form.costPerUnit,
                    border: const OutlineInputBorder(),
                  ),
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  validator: (v) => double.tryParse(v ?? '') == null
                      ? context.t.common.required
                      : null,
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
      ),
    );
  }
}
