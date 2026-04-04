import 'package:equatable/equatable.dart';

class StateSplash extends Equatable {
  const StateSplash({this.isLoading = false});

  final bool isLoading;

  StateSplash copyWith({bool? isLoading}) {
    return StateSplash(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
