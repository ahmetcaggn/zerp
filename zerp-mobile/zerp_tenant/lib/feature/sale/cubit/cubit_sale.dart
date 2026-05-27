import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/service/sale/sale_service.dart';

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
    this.selectedShop,
  });

  final List<ShopDTO> shops;
  final ShopDTO? selectedShop;

  StateSaleLoaded copyWith({
    List<ShopDTO>? shops,
    ShopDTO? selectedShop,
    bool clearSelectedShop = false,
  }) {
    return StateSaleLoaded(
      shops: shops ?? this.shops,
      selectedShop: clearSelectedShop
          ? null
          : (selectedShop ?? this.selectedShop),
    );
  }
}

final class StateSaleError extends StateSale {
  const StateSaleError({required this.message});

  final String message;
}

@injectable
class CubitSale extends Cubit<StateSale> with LoggerMixin<CubitSale> {
  CubitSale(this._saleService) : super(const StateSaleInitial());

  final SaleService _saleService;

  Future<void> loadShops() async {
    emit(const StateSaleLoading());
    try {
      final response = await _saleService.getShops();
      final shops = response.items;
      emit(
        StateSaleLoaded(
          shops: shops,
          selectedShop: shops.isNotEmpty ? shops.first : null,
        ),
      );
    } on Object catch (e) {
      emit(StateSaleError(message: 'Failed to load shops: $e'));
    }
  }

  void selectShop(ShopDTO shop) {
    final state = this.state;
    if (state is StateSaleLoaded) {
      emit(state.copyWith(selectedShop: shop));
    }
  }
}
