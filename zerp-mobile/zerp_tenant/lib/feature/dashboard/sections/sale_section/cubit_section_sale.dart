import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@lazySingleton
class CubitSectionSale extends Cubit<StateSectionSale> {
  CubitSectionSale() : super(const StateSectionSaleInitial());

  Future<void> load() async {}
}

sealed class StateSectionSale {
  const StateSectionSale();
}

final class StateSectionSaleInitial extends StateSectionSale {
  const StateSectionSaleInitial();
}

final class StateSectionSaleLoading extends StateSectionSale {
  const StateSectionSaleLoading();
}

final class StateSectionSaleLoaded extends StateSectionSale {
  const StateSectionSaleLoaded();
}

final class StateSectionSaleError extends StateSectionSale {
  const StateSectionSaleError();
}
