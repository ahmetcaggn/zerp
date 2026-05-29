import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_sale/model/table_order_dto.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/network/page_response.dart';
import 'package:zerp_tenant/product/service/sale/sale_service.dart';

@lazySingleton
class CubitSectionCash extends Cubit<StateSectionCash>
    with LoggerMixin<CubitSectionCash> {
  CubitSectionCash(this._saleService) : super(const StateSectionCashInitial());

  final SaleService _saleService;

  Future<void> load(String shopId) async {
    try {
      emit(const StateSectionCashLoading());
      final response = await _saleService.getShopOrders(
        shopId: shopId,
        pageRequest: const PageRequest(start: 0, end: 3),
      );

      final previews = response.items.map(_buildPreview).toList();

      emit(
        StateSectionCashLoaded(
          latestOrders: previews,
        ),
      );
    } on Object catch (e, s) {
      log.severe('Error loading cash section orders', e, s);
      emit(StateSectionCashError(message: e.toString()));
    }
  }

  CashOrderPreview _buildPreview(TableOrderDTO order) {
    return CashOrderPreview(
      id: order.id ?? '',
      tableName: order.shopTableName,
      status: order.status,
      total: _calculateOrderTotal(order),
      itemCount: _countItems(order),
      createdAt: null,
    );
  }

  num _calculateOrderTotal(TableOrderDTO order) {
    num orderTotal = 0;
    for (final item in order.items) {
      var itemTotal = (item.unitPrice ?? 0) * (item.quantity ?? 1);
      for (final option in item.selectedExtraOptions) {
        itemTotal += (option.price ?? 0) * (item.quantity ?? 1);
      }
      orderTotal += itemTotal;
    }
    return orderTotal;
  }

  int _countItems(TableOrderDTO order) {
    var totalItems = 0;
    for (final item in order.items) {
      totalItems += item.quantity ?? 1;
    }
    return totalItems;
  }
}

class CashOrderPreview {
  const CashOrderPreview({
    required this.id,
    required this.total,
    required this.itemCount,
    required this.status,
    required this.tableName,
    required this.createdAt,
  });

  final String id;
  final num total;
  final int itemCount;
  final TableOrderDTOStatusEnum? status;
  final String? tableName;
  final DateTime? createdAt;
}

sealed class StateSectionCash {
  const StateSectionCash();
}

final class StateSectionCashInitial extends StateSectionCash {
  const StateSectionCashInitial();
}

final class StateSectionCashLoading extends StateSectionCash {
  const StateSectionCashLoading();
}

final class StateSectionCashLoaded extends StateSectionCash {
  const StateSectionCashLoaded({
    required this.latestOrders,
  });

  final List<CashOrderPreview> latestOrders;
}

final class StateSectionCashError extends StateSectionCash {
  const StateSectionCashError({required this.message});

  final String message;
}
