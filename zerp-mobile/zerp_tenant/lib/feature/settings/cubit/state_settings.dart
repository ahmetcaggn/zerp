import 'package:equatable/equatable.dart';

class StateSettings extends Equatable {
  const StateSettings({this.isLoading = false});

  final bool isLoading;

  StateSettings copyWith({bool? isLoading}) {
    return StateSettings(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
