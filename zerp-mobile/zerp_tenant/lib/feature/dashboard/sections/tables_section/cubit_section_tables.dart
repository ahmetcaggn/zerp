import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/sale/sale_service.dart';

@lazySingleton
class CubitSectionTables extends Cubit<StateSectionTables>
    with LoggerMixin<CubitSectionTables> {
  CubitSectionTables(this._saleService)
    : super(const StateSectionTablesInitial());

  final SaleService _saleService;

  Future<void> load(String shopId) async {
    try {
      emit(const StateSectionTablesLoading());
      final allResponseFuture = _saleService.getTables(
        shopId: shopId,
        pageRequest: const PageRequest(start: 0, end: 1),
      );
      final availableResponseFuture = _saleService.getTables(
        shopId: shopId,
        pageRequest: const PageRequest(start: 0, end: 1),
        statusFilter: ShopTableDTOStatusEnum.AVAILABLE,
      );
      final occupiedResponseFuture = _saleService.getTables(
        shopId: shopId,
        pageRequest: const PageRequest(start: 0, end: 1),
        statusFilter: ShopTableDTOStatusEnum.OCCUPIED,
      );
      final reservedResponseFuture = _saleService.getTables(
        shopId: shopId,
        pageRequest: const PageRequest(start: 0, end: 1),
        statusFilter: ShopTableDTOStatusEnum.RESERVED,
      );
      final outOfOrderResponseFuture = _saleService.getTables(
        shopId: shopId,
        pageRequest: const PageRequest(start: 0, end: 1),
        statusFilter: ShopTableDTOStatusEnum.OUT_OF_ORDER,
      );

      await Future.wait([
        allResponseFuture,
        availableResponseFuture,
        occupiedResponseFuture,
        reservedResponseFuture,
        outOfOrderResponseFuture,
      ]);

      final total = (await allResponseFuture).totalCount;
      final available = (await availableResponseFuture).totalCount;
      final occupied = (await occupiedResponseFuture).totalCount;
      final reserved = (await reservedResponseFuture).totalCount;
      final outOfOrder = (await outOfOrderResponseFuture).totalCount;

      emit(
        StateSectionTablesLoaded(
          totalCount: total,
          availableCount: available,
          occupiedCount: occupied,
          reservedCount: reserved,
          outOfOrderCount: outOfOrder,
        ),
      );
    } on Object catch (e, s) {
      log.severe('Error loading tables', e, s);
      emit(StateSectionTablesError(message: e.toString()));
    }
  }
}

sealed class StateSectionTables {
  const StateSectionTables();
}

final class StateSectionTablesInitial extends StateSectionTables {
  const StateSectionTablesInitial();
}

final class StateSectionTablesLoading extends StateSectionTables {
  const StateSectionTablesLoading();
}

final class StateSectionTablesLoaded extends StateSectionTables {
  const StateSectionTablesLoaded({
    required this.totalCount,
    required this.availableCount,
    required this.occupiedCount,
    required this.reservedCount,
    required this.outOfOrderCount,
  });

  final int totalCount;
  final int availableCount;
  final int occupiedCount;
  final int reservedCount;
  final int outOfOrderCount;
}

final class StateSectionTablesError extends StateSectionTables {
  const StateSectionTablesError({required this.message});

  final String message;
}
