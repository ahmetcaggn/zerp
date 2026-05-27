import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_sale/api.dart';
import 'package:zerp_tenant/feature/sale/cubit/cubit_sale.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenSale extends StatelessWidget {
  const ScreenSale({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt<CubitSale>();
        unawaited(cubit.loadShops());
        return cubit;
      },
      child: Builder(
        builder: (context) {
          return AppScaffold(
            title: context.t.sale.title,
            body: BlocBuilder<CubitSale, StateSale>(
              builder: (context, state) {
                switch (state) {
                  case StateSaleInitial() || StateSaleLoading():
                    return const Center(child: CircularProgressIndicator());
                  case StateSaleError():
                    return _Error(state: state);
                  case StateSaleLoaded():
                    return _Loaded(state: state);
                }
              },
            ),
          );
        },
      ),
    );
  }
}

final class _Error extends StatelessWidget {
  const _Error({required this.state});

  final StateSaleError state;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.error_outline,
            size: 48,
            color: Colors.red,
          ),
          const SizedBox(height: 16),
          Text(state.message, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => context.read<CubitSale>().loadShops(),
            child: Text(context.t.common.retry),
          ),
        ],
      ),
    );
  }
}

final class _Loaded extends StatelessWidget {
  const _Loaded({required this.state});

  final StateSaleLoaded state;

  @override
  Widget build(BuildContext context) {
    final shops = state.shops;
    final selectedShop = state.selectedShop;

    if (shops.isEmpty) {
      return Center(
        child: Text(context.t.sale.dashboard.empty),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 16),
          Text(
            context.t.sale.dashboard.selectShop,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Card(
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(
                color: Theme.of(
                  context,
                ).colorScheme.outlineVariant,
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 4,
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButtonFormField<ShopDTO>(
                  initialValue: selectedShop,
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                  ),
                  items: shops.map((shop) {
                    return DropdownMenuItem<ShopDTO>(
                      value: shop,
                      child: Text(
                        shop.name ?? '',
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    );
                  }).toList(),
                  onChanged: (shop) {
                    if (shop != null) {
                      context.read<CubitSale>().selectShop(
                        shop,
                      );
                    }
                  },
                ),
              ),
            ),
          ),
          const SizedBox(height: 32),
          Row(
            children: [
              Expanded(
                child: _DashboardButton(
                  title: context.t.sale.dashboard.tables,
                  icon: Icons.table_restaurant_outlined,
                  color: Theme.of(context).colorScheme.primary,
                  onPressed: selectedShop != null
                      ? () {
                          unawaited(
                            context.router.push(
                              RouteTables(
                                shopId: selectedShop.id ?? '',
                                shopName: selectedShop.name ?? '',
                              ),
                            ),
                          );
                        }
                      : null,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _DashboardButton(
                  title: context.t.sale.dashboard.cash,
                  icon: Icons.point_of_sale_outlined,
                  color: Theme.of(
                    context,
                  ).colorScheme.secondary,
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          context.t.sale.dashboard.cashComingSoon,
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

final class _DashboardButton extends StatelessWidget {
  const _DashboardButton({
    required this.title,
    required this.icon,
    required this.color,
    this.onPressed,
  });

  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 140,
      child: Card(
        elevation: 3,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        color: onPressed == null
            ? Theme.of(context).colorScheme.surfaceContainerHighest
            : Colors.white,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  icon,
                  size: 44,
                  color: onPressed == null ? Colors.grey : color,
                ),
                const SizedBox(height: 12),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: onPressed == null ? Colors.grey : Colors.black87,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
