import 'package:equatable/equatable.dart';

class StateLogin extends Equatable {
  const StateLogin({this.isLoading = false});

  final bool isLoading;

  StateLogin copyWith({bool? isLoading}) {
    return StateLogin(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
