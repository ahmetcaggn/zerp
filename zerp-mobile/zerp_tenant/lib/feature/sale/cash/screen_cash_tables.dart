import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/sale/cash/cubit/cubit_cash_tables.dart';
import 'package:zerp_tenant/feature/sale/cash/widget/cash_table_card.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenCashTables extends StatelessWidget {
  const ScreenCashTables({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) {
        final cubit = getIt<CubitCashTables>();
        unawaited(cubit.init());
        return cubit;
      },
      child: const _View(),
    );
  }
}

class _View extends StatefulWidget {
  const _View();

  @override
  State<_View> createState() => _ViewState();
}

class _ViewState extends State<_View> {
  final TextEditingController _searchController = TextEditingController();
  Timer? _debounce;

  @override
  void dispose() {
    _searchController.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () async {
      await context.read<CubitCashTables>().fetchTables(
        reset: true,
        query: query.trim().isEmpty ? null : query.trim(),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: context.t.sale.cash.title,
      titleWidget: BlocBuilder<CubitOrganizationScope, StateOrganizationScope>(
        builder: (context, state) {
          if (state is! StateOrganizationScopeShop) {
            return Text(context.t.sale.cash.title);
          }
          final shopName = state.shop.name ?? '';
          return Text('$shopName - ${context.t.sale.cash.title}');
        },
      ),
      actions: [
        IconButton(
          tooltip: context.t.sale.cash.refresh,
          icon: const Icon(Icons.refresh),
          onPressed: () {
            unawaited(
              context.read<CubitCashTables>().fetchTables(
                reset: true,
                query: () {
                  final text = _searchController.text.trim();
                  return text.isEmpty ? null : text;
                }(),
              ),
            );
          },
        ),
      ],
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: context.t.sale.cash.searchTables,
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          unawaited(
                            context.read<CubitCashTables>().fetchTables(
                              reset: true,
                            ),
                          );
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                ),
              ),
              onChanged: _onSearchChanged,
            ),
          ),
          Expanded(
            child: BlocBuilder<CubitCashTables, StateCashTables>(
              builder: (context, state) {
                switch (state) {
                  case StateCashTablesInitial() || StateCashTablesLoading():
                    return const Center(
                      child: CircularProgressIndicator(),
                    );
                  case StateCashTablesError():
                    return _Error(
                      state: state,
                      searchController: _searchController,
                    );
                  case StateCashTablesLoaded():
                    return _Loaded(
                      state: state,
                      searchController: _searchController,
                    );
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}

final class _Error extends StatelessWidget {
  const _Error({
    required this.state,
    required this.searchController,
  });

  final StateCashTablesError state;
  final TextEditingController searchController;

  @override
  Widget build(BuildContext context) {
    final message = state.message;
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
          Text(message, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => context.read<CubitCashTables>().fetchTables(
              reset: true,
              query: searchController.text.trim().isEmpty
                  ? null
                  : searchController.text.trim(),
            ),
            child: Text(context.t.sale.cash.retry),
          ),
        ],
      ),
    );
  }
}

final class _Loaded extends StatefulWidget {
  const _Loaded({
    required this.state,
    required this.searchController,
  });

  final StateCashTablesLoaded state;
  final TextEditingController searchController;

  @override
  State<_Loaded> createState() => _LoadedState();
}

class _LoadedState extends State<_Loaded> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _onScroll() async {
    if (_isBottom) {
      await context.read<CubitCashTables>().fetchTables(
        query: widget.searchController.text.trim().isEmpty
            ? null
            : widget.searchController.text.trim(),
      );
    }
  }

  bool get _isBottom {
    if (!_scrollController.hasClients) return false;
    final maxScroll = _scrollController.position.maxScrollExtent;
    final currentScroll = _scrollController.offset;
    return currentScroll >= (maxScroll * 0.9);
  }

  @override
  Widget build(BuildContext context) {
    final items = widget.state.items;
    final hasMore = widget.state.hasMore;

    if (items.isEmpty) {
      return Center(
        child: Text(context.t.sale.cash.emptyTables),
      );
    }

    return GridView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 8,
      ),
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 192,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: items.length + (hasMore ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == items.length) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: CircularProgressIndicator(),
            ),
          );
        }
        final table = items[index];
        return CashTableCard(
          table: table,
          onTap: () {
            unawaited(
              context.router.push(
                RouteCashOrder(
                  tableId: table.id ?? '',
                  tableName: table.name ?? '',
                ),
              ),
            );
          },
        );
      },
    );
  }
}
