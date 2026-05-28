import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/service/sale/sale_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@injectable
class CubitSale extends Cubit<StateSale> with LoggerMixin<CubitSale> {
  CubitSale(this._saleService) : super(const StateSaleInitial());

  final SaleService _saleService;

  Future<void> loadShops() async {
    emit(const StateSaleLoading());
    try {
      final response = await _saleService.getShops();
      final shops = response.items;
      emit(StateSaleLoaded(shops: shops));
    } on Object catch (e) {
      emit(
        StateSaleError(
          message: t.sale.errors.failedToLoadShops(error: e.toString()),
        ),
      );
    }
  }
}

sealed class StateSale {
  const StateSale();
}

final class StateSaleInitial extends StateSale {
  const StateSaleInitial();
}

final class StateSaleLoading extends StateSale {
  const StateSaleLoading();
}

final class StateSaleLoaded extends StateSale {
  const StateSaleLoaded({
    required this.shops,
  });

  final List<ShopDTO> shops;

  StateSaleLoaded copyWith({
    List<ShopDTO>? shops,
  }) {
    return StateSaleLoaded(
      shops: shops ?? this.shops,
    );
  }
}

final class StateSaleError extends StateSale {
  const StateSaleError({required this.message});

  final String message;
}
