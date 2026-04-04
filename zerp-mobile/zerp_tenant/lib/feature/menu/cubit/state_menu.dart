import 'package:equatable/equatable.dart';

class StateMenu extends Equatable {
  const StateMenu({this.isLoading = false});

  final bool isLoading;

  StateMenu copyWith({bool? isLoading}) {
    return StateMenu(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
