import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_sale/api.dart';
import 'package:zerp_tenant/feature/sale/table/order/cubit/cubit_table_order.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/extra_option_select_dialog.dart';
import 'package:zerp_tenant/product/util/image_url_factory.dart';

class CatalogItem extends StatelessWidget {
  const CatalogItem({
    required this.extraOptions,
    required this.data,
    super.key,
  });

  final List<ProductExtraOptionDTO> extraOptions;
  final MenuItemDTO data;

  @override
  Widget build(BuildContext context) {
    final imageId = data.imageId;
    final imageUrl = (imageId != null && imageId.isNotEmpty)
        ? MenuItemImageUrlFactory(imageId).urlMedium
        : null;

    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: Theme.of(context).colorScheme.outlineVariant,
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        fit: StackFit.expand,
        children: [
          if (imageUrl != null)
            Image.network(
              imageUrl,
              fit: BoxFit.cover,
              loadingBuilder: (context, child, loadingProgress) {
                if (loadingProgress == null) return child;
                return const _LoadingShade();
              },
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  color: Theme.of(
                    context,
                  ).colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
                  alignment: Alignment.center,
                  child: Icon(
                    Icons.broken_image_outlined,
                    size: 40,
                    color: Theme.of(
                      context,
                    ).colorScheme.onSurfaceVariant.withValues(alpha: 0.2),
                  ),
                );
              },
            )
          else
            Container(
              color: Theme.of(
                context,
              ).colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
              alignment: Alignment.center,
              child: Icon(
                Icons.restaurant,
                size: 48,
                color: Theme.of(
                  context,
                ).colorScheme.onSurfaceVariant.withValues(alpha: 0.15),
              ),
            ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withValues(alpha: imageUrl != null ? 0.2 : 0.0),
                  Colors.black.withValues(alpha: imageUrl != null ? 0.7 : 0.0),
                ],
              ),
            ),
          ),
          Positioned.fill(
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () async {
                  final productIds = data.productItems
                      .map((p) => p.productId)
                      .toSet();
                  final itemOptions = extraOptions
                      .where((opt) => productIds.contains(opt.productId))
                      .toList();

                  if (itemOptions.isEmpty) {
                    context.read<CubitTableOrder>().addMenuItemToOrder(
                      data,
                    );
                  } else {
                    final selectedOptions = await ExtraOptionSelectDialog.show(
                      context,
                      menuItem: data,
                      options: itemOptions,
                    );
                    if (selectedOptions != null && context.mounted) {
                      context.read<CubitTableOrder>().addMenuItemToOrder(
                        data,
                        selectedExtraOptions: selectedOptions,
                      );
                    }
                  }
                },
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        data.name ?? '',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: imageUrl != null ? Colors.white : null,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '₺${(data.price ?? 0).toStringAsFixed(2)}',
                        style: TextStyle(
                          color: imageUrl != null
                              ? Colors.white.withValues(alpha: 0.9)
                              : Theme.of(context).colorScheme.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LoadingShade extends StatefulWidget {
  const _LoadingShade();

  @override
  State<_LoadingShade> createState() => _LoadingShadeState();
}

class _LoadingShadeState extends State<_LoadingShade>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    unawaited(_controller.repeat(reverse: true));
    _animation = Tween<double>(begin: 0.3, end: 0.8).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          color: Theme.of(context).colorScheme.surfaceContainerHighest
              .withValues(alpha: _animation.value),
        );
      },
    );
  }
}
