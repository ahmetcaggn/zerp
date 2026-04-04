import 'package:equatable/equatable.dart';

class StateEmployee extends Equatable {
  const StateEmployee({this.isLoading = false});

  final bool isLoading;

  StateEmployee copyWith({bool? isLoading}) {
    return StateEmployee(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
