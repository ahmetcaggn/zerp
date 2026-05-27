import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/service/sale/sale_service.dart';

@injectable
class CubitCashPayment extends Cubit<StateCashPayment>
    with LoggerMixin<CubitCashPayment> {
  CubitCashPayment(this._saleService) : super(const StateCashPaymentInitial());

  final SaleService _saleService;

  Future<void> executePayment({
    required List<TableOrderDTO> orders,
    required Map<String, int> selectedQtys,
  }) async {
    emit(const StateCashPaymentLoading());
    try {
      final paymentPlan = <_PaymentPlanItem>[];
      for (final order in orders) {
        var hasSelected = false;
        final remainingItems = <TableOrderItemCreateDTO>[];
        for (final item in order.items) {
          final itemId = item.id;
          final maxQty = item.quantity ?? 1;
          final selectedQty =
              (itemId != null && selectedQtys.containsKey(itemId))
              ? selectedQtys[itemId]!
              : 0;

          if (selectedQty > 0) hasSelected = true;

          final leftQty = maxQty - selectedQty;
          if (leftQty > 0) {
            remainingItems.add(
              TableOrderItemCreateDTO(
                menuItemId: item.menuItemId,
                quantity: leftQty,
                notes: item.notes,
                selectedExtraOptionIds: item.selectedExtraOptions
                    .map((e) => e.extraOptionId ?? '')
                    .where((id) => id.isNotEmpty)
                    .toList(),
              ),
            );
          }
        }

        if (hasSelected) {
          paymentPlan.add(
            _PaymentPlanItem(
              orderId: order.id ?? '',
              isFullOrder: remainingItems.isEmpty,
              remainingItems: remainingItems,
            ),
          );
        }
      }

      for (final plan in paymentPlan) {
        if (plan.isFullOrder) {
          await _saleService.markOrderAsPaid(orderId: plan.orderId);
        } else {
          final updateDTO = TableOrderUpdateDTO(
            status: TableOrderUpdateDTOStatusEnum.OPEN,
            items: plan.remainingItems,
          );
          await _saleService.updateTableOrder(
            orderId: plan.orderId,
            updateDTO: updateDTO,
          );
        }
      }

      emit(const StateCashPaymentSuccess());
    } on Object catch (e) {
      log.severe('Payment execution failed: $e');
      emit(StateCashPaymentError(message: e.toString()));
    }
  }
}

class _PaymentPlanItem {
  _PaymentPlanItem({
    required this.orderId,
    required this.isFullOrder,
    required this.remainingItems,
  });

  final String orderId;
  final bool isFullOrder;
  final List<TableOrderItemCreateDTO> remainingItems;
}

sealed class StateCashPayment {
  const StateCashPayment();
}

final class StateCashPaymentInitial extends StateCashPayment {
  const StateCashPaymentInitial();
}

final class StateCashPaymentLoading extends StateCashPayment {
  const StateCashPaymentLoading();
}

final class StateCashPaymentSuccess extends StateCashPayment {
  const StateCashPaymentSuccess();
}

final class StateCashPaymentError extends StateCashPayment {
  const StateCashPaymentError({required this.message});

  final String message;
}
