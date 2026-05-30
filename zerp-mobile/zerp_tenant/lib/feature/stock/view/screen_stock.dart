import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_sale/api.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_counts.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_movements.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_operations.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_resources.dart';
import 'package:zerp_tenant/feature/stock/view/widgets/stock_counts_tab.dart';
import 'package:zerp_tenant/feature/stock/view/widgets/stock_kpi_row.dart';
import 'package:zerp_tenant/feature/stock/view/widgets/stock_movement_tab.dart';
import 'package:zerp_tenant/feature/stock/view/widgets/stock_resource_tab.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/service/sale/sale_service.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenStock extends StatefulWidget {
  const ScreenStock({super.key});

  @override
  State<ScreenStock> createState() => _ScreenStockState();
}

class _ScreenStockState extends State<ScreenStock>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  late final CubitStock _cubitStock;
  late final CubitStockResources _cubitResources;
  late final CubitStockMovements _cubitMovements;
  late final CubitStockCounts _cubitCounts;
  late final CubitStockOperations _cubitOperations;

  List<ShopDTO> _shops = [];
  ShopDTO? _selectedShop;
  bool _shopsLoading = true;

  @override
  void initState() {
    super.initState();
    _cubitStock = getIt<CubitStock>();
    _cubitResources = getIt<CubitStockResources>();
    _cubitMovements = getIt<CubitStockMovements>();
    _cubitCounts = getIt<CubitStockCounts>();
    _cubitOperations = getIt<CubitStockOperations>();

    _tabController = TabController(length: 3, vsync: this);
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        _cubitStock.selectTab(_tabController.index);
      }
    });

    unawaited(_loadShops());
  }

  Future<void> _loadShops() async {
    try {
      final saleService = getIt<SaleService>();
      final result = await saleService.getShops();
      if (mounted) {
        setState(() {
          _shops = result.items;
          _shopsLoading = false;
          if (_shops.isNotEmpty) {
            _selectedShop = _shops.first;
            _cubitStock.setShop(_selectedShop!.id);
          }
        });
      }
    } on Object {
      if (mounted) setState(() => _shopsLoading = false);
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t.stock;
    final shopId = _selectedShop?.id;

    return MultiBlocProvider(
      providers: [
        BlocProvider.value(value: _cubitStock),
        BlocProvider.value(value: _cubitResources),
        BlocProvider.value(value: _cubitMovements),
        BlocProvider.value(value: _cubitCounts),
        BlocProvider.value(value: _cubitOperations),
      ],
      child: AppScaffold(
        title: t.title,
        body: shopId == null
            ? Center(
                child: Text(
                  t.noShopSelected,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
              )
            : Column(
                children: [
                  // ── KPI Row (only when shop selected and resources loaded)
                  BlocBuilder<CubitStockResources, StateStockResources>(
                    buildWhen: (previous, current) {
                      if (current is StateStockResourcesLoading &&
                          previous is StateStockResourcesLoaded) {
                        return false;
                      }
                      return true;
                    },
                    builder: (context, state) {
                      if (state is StateStockResourcesLoaded &&
                          state.overview.isNotEmpty) {
                        return StockKpiRow(overview: state.overview);
                      }
                      return const SizedBox.shrink();
                    },
                  ),

                  // ── Tab Bar ──
                  TabBar(
                    controller: _tabController,
                    tabs: [
                      Tab(text: t.tabs.resources),
                      Tab(text: t.tabs.movements),
                      Tab(text: t.tabs.counts),
                    ],
                  ),

                  // ── Tab Body ──
                  Expanded(
                    child: _shopsLoading
                        ? const Center(child: CircularProgressIndicator())
                        : TabBarView(
                            controller: _tabController,
                            children: [
                              StockResourceTab(shopId: shopId),
                              StockMovementTab(shopId: shopId),
                              StockCountsTab(shopId: shopId),
                            ],
                          ),
                  ),
                ],
              ),
      ),
    );
  }
}
