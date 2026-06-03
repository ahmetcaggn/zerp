import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_sale/model/menu_category_dto.dart';
import 'package:openapi_sale/model/menu_item_dto.dart';
import 'package:openapi_sale/model/product_extra_option_dto.dart';
import 'package:zerp_tenant/feature/sale/table/order/cubit/cubit_table_order.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/catalog_item.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

final class CatalogSection extends StatelessWidget {
  const CatalogSection({
    required this.categories,
    required this.menuItems,
    required this.extraOptions,
    required this.selectedCategoryId,
    required this.scrollable,
    required this.isCatalogLoading,
    super.key,
  });

  final List<MenuCategoryDTO> categories;
  final List<MenuItemDTO> menuItems;
  final List<ProductExtraOptionDTO> extraOptions;
  final String? selectedCategoryId;
  final bool scrollable;
  final bool isCatalogLoading;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 8),
        SizedBox(
          height: 40,
          child: Row(
            children: [
              Expanded(
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
              if (isCatalogLoading)
                const AspectRatio(
                  aspectRatio: 1,
                  child: SizedBox(
                    child: Padding(
                      padding: EdgeInsets.all(12),
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  ),
                )
              else
                IconButton(
                  icon: const Icon(Icons.refresh_rounded),
                  onPressed: () {
                    unawaited(context.read<CubitTableOrder>().refreshCatalog());
                  },
                ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Expanded(
          child: Builder(
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
                physics: scrollable
                    ? null
                    : const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                  maxCrossAxisExtent: 192,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: filteredItems.length,
                itemBuilder: (context, index) {
                  final item = filteredItems[index];
                  return CatalogItem(
                    extraOptions: extraOptions,
                    data: item,
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }
}
