import 'package:equatable/equatable.dart';

class StateStock extends Equatable {
  const StateStock({this.isLoading = false});

  final bool isLoading;

  StateStock copyWith({bool? isLoading}) {
    return StateStock(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
