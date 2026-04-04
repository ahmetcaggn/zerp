import 'package:equatable/equatable.dart';

class StateStore extends Equatable {
  const StateStore({this.isLoading = false});

  final bool isLoading;

  StateStore copyWith({bool? isLoading}) {
    return StateStore(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
