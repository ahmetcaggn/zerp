import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@lazySingleton
class CubitSectionMenu extends Cubit<StateSectionMenu> {
  CubitSectionMenu() : super(const StateSectionMenuInitial());

  Future<void> load() async {}
}

sealed class StateSectionMenu {
  const StateSectionMenu();
}

final class StateSectionMenuInitial extends StateSectionMenu {
  const StateSectionMenuInitial();
}

final class StateSectionMenuLoading extends StateSectionMenu {
  const StateSectionMenuLoading();
}

final class StateSectionMenuLoaded extends StateSectionMenu {
  const StateSectionMenuLoaded();
}

final class StateSectionMenuError extends StateSectionMenu {
  const StateSectionMenuError();
}
