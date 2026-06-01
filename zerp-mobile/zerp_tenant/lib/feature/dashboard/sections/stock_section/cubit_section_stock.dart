import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@lazySingleton
class CubitSectionStock extends Cubit<StateSectionStock> {
  CubitSectionStock() : super(const StateSectionStockInitial());

  Future<void> load(String shopId) async {}
}

sealed class StateSectionStock {
  const StateSectionStock();
}

final class StateSectionStockInitial extends StateSectionStock {
  const StateSectionStockInitial();
}

final class StateSectionStockLoading extends StateSectionStock {
  const StateSectionStockLoading();
}

final class StateSectionStockLoaded extends StateSectionStock {
  const StateSectionStockLoaded();
}

final class StateSectionStockError extends StateSectionStock {
  const StateSectionStockError();
}
