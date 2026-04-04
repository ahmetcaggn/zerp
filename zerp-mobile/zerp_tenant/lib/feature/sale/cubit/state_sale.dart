import 'package:equatable/equatable.dart';

class StateSale extends Equatable {
  const StateSale({this.isLoading = false});

  final bool isLoading;

  StateSale copyWith({bool? isLoading}) {
    return StateSale(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
