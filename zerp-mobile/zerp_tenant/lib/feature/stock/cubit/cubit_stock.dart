import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:remote_logging/remote_logging.dart';

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

sealed class StateStock {
  const StateStock();
}

final class StateStockInitial extends StateStock {
  const StateStockInitial();
}

final class StateStockReady extends StateStock {
  const StateStockReady({
    this.selectedTab = 0,
    this.selectedShopId,
  });

  final int selectedTab;
  final String? selectedShopId;

  StateStockReady copyWith({
    int? selectedTab,
    String? selectedShopId,
  }) {
    return StateStockReady(
      selectedTab: selectedTab ?? this.selectedTab,
      selectedShopId: selectedShopId ?? this.selectedShopId,
    );
  }
}

// ---------------------------------------------------------------------------
// Cubit
// ---------------------------------------------------------------------------

@injectable
class CubitStock extends Cubit<StateStock> with LoggerMixin<CubitStock> {
  CubitStock() : super(const StateStockReady());

  void selectTab(int index) {
    final current = state;
    if (current is StateStockReady) {
      emit(current.copyWith(selectedTab: index));
    }
  }

  void setShop(String? shopId) {
    final current = state;
    if (current is StateStockReady) {
      emit(current.copyWith(selectedShopId: shopId));
    }
  }
}
