import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/base_cubit.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/sale/sale_service.dart';

@injectable
class CubitCashTables extends BaseCubit<StateCashTables>
    with LoggerMixin<CubitCashTables> {
  CubitCashTables(
    this._saleService,
    @factoryParam this.shopId,
  ) : super(const StateCashTablesInitial());

  final String shopId;
  final SaleService _saleService;
  static const int pageSize = 20;

  Future<void> init() async {
    await fetchTables(reset: true);
  }

  Future<void> fetchTables({
    bool reset = false,
    String? query,
  }) async {
    final currentState = state;
    if (currentState is StateCashTablesLoaded && !reset) {
      if (!currentState.hasMore || currentState.isLoadingMore) return;
      emit(currentState.copyWith(isLoadingMore: true));
    } else {
      emit(const StateCashTablesLoading());
    }

    try {
      final page = (currentState is StateCashTablesLoaded && !reset)
          ? currentState.currentPage + 1
          : 0;

      final pageRequest = PageRequest(
        start: page * pageSize,
        end: (page + 1) * pageSize,
      );

      final response = await _saleService.getTables(
        shopId: shopId,
        pageRequest: pageRequest,
        searchName: query,
      );

      final loadedItems = response.items;
      final total = response.totalCount;

      List<ShopTableDTO> newItems;
      if (currentState is StateCashTablesLoaded && !reset) {
        newItems = List.from(currentState.items)..addAll(loadedItems);
      } else {
        newItems = loadedItems;
      }

      final hasMore = newItems.length < total;

      emit(
        StateCashTablesLoaded(
          items: newItems,
          totalCount: total,
          currentPage: page,
          hasMore: hasMore,
          searchQuery: query,
        ),
      );
    } on Object catch (e) {
      emit(StateCashTablesError(message: 'Failed to load tables: $e'));
    }
  }

  Future<void> refreshTable(String tableId) async {
    final currentState = state;
    if (currentState is StateCashTablesLoaded) {
      try {
        final updatedTable = await _saleService.getTableById(tableId);
        final updatedItems = currentState.items.map((table) {
          if (table.id == tableId) {
            return updatedTable;
          }
          return table;
        }).toList();

        emit(currentState.copyWith(items: updatedItems));
      } on Object catch (e) {
        log.warning('Failed to refresh table $tableId: $e');
      }
    }
  }
}

sealed class StateCashTables {
  const StateCashTables();
}

final class StateCashTablesInitial extends StateCashTables {
  const StateCashTablesInitial();
}

final class StateCashTablesLoading extends StateCashTables {
  const StateCashTablesLoading();
}

final class StateCashTablesLoaded extends StateCashTables {
  const StateCashTablesLoaded({
    required this.items,
    required this.totalCount,
    required this.currentPage,
    required this.hasMore,
    this.searchQuery,
    this.isLoadingMore = false,
  });

  final List<ShopTableDTO> items;
  final int totalCount;
  final int currentPage;
  final bool hasMore;
  final String? searchQuery;
  final bool isLoadingMore;

  StateCashTablesLoaded copyWith({
    List<ShopTableDTO>? items,
    int? totalCount,
    int? currentPage,
    bool? hasMore,
    String? searchQuery,
    bool? isLoadingMore,
  }) {
    return StateCashTablesLoaded(
      items: items ?? this.items,
      totalCount: totalCount ?? this.totalCount,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
      searchQuery: searchQuery ?? this.searchQuery,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
    );
  }
}

final class StateCashTablesError extends StateCashTables {
  const StateCashTablesError({required this.message});

  final String message;
}
