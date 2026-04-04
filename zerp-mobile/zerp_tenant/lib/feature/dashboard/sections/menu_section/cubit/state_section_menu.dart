import 'package:equatable/equatable.dart';

class StateSectionMenu extends Equatable {
  const StateSectionMenu({this.isLoading = false});

  final bool isLoading;

  StateSectionMenu copyWith({bool? isLoading}) {
    return StateSectionMenu(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
