import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_sale/model/menu_category_dto.dart';
import 'package:openapi_sale/model/menu_item_dto.dart';
import 'package:openapi_sale/model/product_extra_option_dto.dart';
import 'package:zerp_tenant/feature/sale/table/order/cubit/cubit_table_order.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/extra_option_select_dialog.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

final class CatalogSection extends StatelessWidget {
  const CatalogSection({
    required this.categories,
    required this.menuItems,
    required this.extraOptions,
    required this.selectedCategoryId,
    required this.scrollable,
    super.key,
  });

  final List<MenuCategoryDTO> categories;
  final List<MenuItemDTO> menuItems;
  final List<ProductExtraOptionDTO> extraOptions;
  final String? selectedCategoryId;
  final bool scrollable;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 8),
        SizedBox(
          height: 40,
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 12),
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
              padding: const EdgeInsets.symmetric(horizontal: 12),
              shrinkWrap: true,
              physics: scrollable ? null : const NeverScrollableScrollPhysics(),
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
                    onTap: () async {
                      final productIds = item.productItems
                          .map((p) => p.productId)
                          .toSet();
                      final itemOptions = extraOptions
                          .where((opt) => productIds.contains(opt.productId))
                          .toList();

                      if (itemOptions.isEmpty) {
                        context.read<CubitTableOrder>().addMenuItemToOrder(
                          item,
                        );
                      } else {
                        final selectedOptions =
                            await ExtraOptionSelectDialog.show(
                              context,
                              menuItem: item,
                              options: itemOptions,
                            );
                        if (selectedOptions != null && context.mounted) {
                          context.read<CubitTableOrder>().addMenuItemToOrder(
                            item,
                            selectedExtraOptions: selectedOptions,
                          );
                        }
                      }
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
