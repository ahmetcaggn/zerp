import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@lazySingleton
class CubitSectionStore extends Cubit<StateSectionStore> {
  CubitSectionStore() : super(const StateSectionStoreInitial());

  Future<void> load() async {}
}

sealed class StateSectionStore {
  const StateSectionStore();
}

final class StateSectionStoreInitial extends StateSectionStore {
  const StateSectionStoreInitial();
}

final class StateSectionStoreLoading extends StateSectionStore {
  const StateSectionStoreLoading();
}

final class StateSectionStoreLoaded extends StateSectionStore {
  const StateSectionStoreLoaded();
}

final class StateSectionStoreError extends StateSectionStore {
  const StateSectionStoreError();
}
