import 'package:flutter/material.dart';
import 'package:openapi_sale/api.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class ExtraOptionSelectDialog extends StatefulWidget {
  const ExtraOptionSelectDialog({
    required this.menuItem,
    required this.options,
    super.key,
  });

  final MenuItemDTO menuItem;
  final List<ProductExtraOptionDTO> options;

  static Future<List<ProductExtraOptionDTO>?> show(
    BuildContext context, {
    required MenuItemDTO menuItem,
    required List<ProductExtraOptionDTO> options,
  }) {
    return showDialog<List<ProductExtraOptionDTO>>(
      context: context,
      builder: (context) => ExtraOptionSelectDialog(
        menuItem: menuItem,
        options: options,
      ),
    );
  }

  @override
  State<ExtraOptionSelectDialog> createState() =>
      _ExtraOptionSelectDialogState();
}

class _ExtraOptionSelectDialogState extends State<ExtraOptionSelectDialog> {
  final Set<String> _selectedOptionIds = {};

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.menuItem.name ?? ''),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Text(
                context.t.sale.order.extraOptionsTitle,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            ...widget.options.map((option) {
              final optionId = option.id;
              if (optionId == null) return const SizedBox.shrink();
              final isSelected = _selectedOptionIds.contains(optionId);
              final price = option.price ?? 0;
              return CheckboxListTile(
                title: Text(option.name ?? ''),
                subtitle: Text('+ ₺${price.toStringAsFixed(2)}'),
                value: isSelected,
                onChanged: (val) {
                  setState(() {
                    if (val == true) {
                      _selectedOptionIds.add(optionId);
                    } else {
                      _selectedOptionIds.remove(optionId);
                    }
                  });
                },
                contentPadding: EdgeInsets.zero,
                controlAffinity: ListTileControlAffinity.leading,
              );
            }),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text(context.t.common.cancel),
        ),
        ElevatedButton(
          onPressed: () {
            final selected = widget.options
                .where((opt) => _selectedOptionIds.contains(opt.id))
                .toList();
            Navigator.of(context).pop(selected);
          },
          child: Text(context.t.common.ok),
        ),
      ],
    );
  }
}
