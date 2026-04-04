import 'package:equatable/equatable.dart';

class StateSectionSale extends Equatable {
  const StateSectionSale({this.isLoading = false});

  final bool isLoading;

  StateSectionSale copyWith({bool? isLoading}) {
    return StateSectionSale(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
