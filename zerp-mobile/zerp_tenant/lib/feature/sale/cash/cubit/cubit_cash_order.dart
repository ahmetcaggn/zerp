import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/service/sale/sale_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@injectable
class CubitCashOrder extends Cubit<StateCashOrder>
    with LoggerMixin<CubitCashOrder> {
  CubitCashOrder(this._saleService) : super(const StateCashOrderInitial());

  final SaleService _saleService;

  Future<void> init(String tableId) async {
    emit(const StateCashOrderLoading());
    try {
      final activeOrders = await _saleService.getActiveOrders(tableId: tableId);
      emit(StateCashOrderLoaded(orders: activeOrders, selectedQtys: const {}));
    } on Object catch (e) {
      emit(
        StateCashOrderError(
          message: t.sale.errors.failedToInitOrder(error: e.toString()),
        ),
      );
    }
  }

  void updateQty(String itemId, int newQty) {
    final currentState = state;
    if (currentState is StateCashOrderLoaded) {
      final newQtys = Map<String, int>.from(currentState.selectedQtys);
      if (newQty <= 0) {
        newQtys.remove(itemId);
      } else {
        newQtys[itemId] = newQty;
      }
      emit(currentState.copyWith(selectedQtys: newQtys));
    }
  }

  void selectAll() {
    final currentState = state;
    if (currentState is StateCashOrderLoaded) {
      final newQtys = <String, int>{};
      for (final order in currentState.orders) {
        for (final item in order.items) {
          if (item.id != null) {
            newQtys[item.id!] = item.quantity ?? 1;
          }
        }
      }
      emit(currentState.copyWith(selectedQtys: newQtys));
    }
  }

  void clearAll() {
    final currentState = state;
    if (currentState is StateCashOrderLoaded) {
      emit(currentState.copyWith(selectedQtys: const {}));
    }
  }
}

sealed class StateCashOrder {
  const StateCashOrder();
}

final class StateCashOrderInitial extends StateCashOrder {
  const StateCashOrderInitial();
}

final class StateCashOrderLoading extends StateCashOrder {
  const StateCashOrderLoading();
}

final class StateCashOrderLoaded extends StateCashOrder {
  const StateCashOrderLoaded({
    required this.orders,
    required this.selectedQtys,
  });

  final List<TableOrderDTO> orders;
  final Map<String, int> selectedQtys;

  bool get isAllSelected {
    for (final order in orders) {
      for (final item in order.items) {
        if (item.id != null) {
          if ((selectedQtys[item.id] ?? 0) < (item.quantity ?? 1)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  double get selectedTotal {
    double total = 0;
    for (final order in orders) {
      for (final item in order.items) {
        if (item.id != null && selectedQtys.containsKey(item.id)) {
          final qty = selectedQtys[item.id]!;
          var unitPrice = item.unitPrice?.toDouble() ?? 0.0;
          for (final opt in item.selectedExtraOptions) {
            unitPrice += opt.price?.toDouble() ?? 0.0;
          }
          total += unitPrice * qty;
        }
      }
    }
    return total;
  }

  int get totalSelectedCount {
    var count = 0;
    for (final qty in selectedQtys.values) {
      count += qty;
    }
    return count;
  }

  StateCashOrderLoaded copyWith({
    List<TableOrderDTO>? orders,
    Map<String, int>? selectedQtys,
  }) {
    return StateCashOrderLoaded(
      orders: orders ?? this.orders,
      selectedQtys: selectedQtys ?? this.selectedQtys,
    );
  }
}

final class StateCashOrderError extends StateCashOrder {
  const StateCashOrderError({required this.message});

  final String message;
}
