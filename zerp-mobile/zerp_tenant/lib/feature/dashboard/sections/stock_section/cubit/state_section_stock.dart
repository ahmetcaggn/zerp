import 'package:equatable/equatable.dart';

class StateSectionStock extends Equatable {
  const StateSectionStock({this.isLoading = false});

  final bool isLoading;

  StateSectionStock copyWith({bool? isLoading}) {
    return StateSectionStock(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
