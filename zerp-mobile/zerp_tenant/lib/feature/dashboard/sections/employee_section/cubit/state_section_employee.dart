import 'package:equatable/equatable.dart';

class StateSectionEmployee extends Equatable {
  const StateSectionEmployee({this.isLoading = false});

  final bool isLoading;

  StateSectionEmployee copyWith({bool? isLoading}) {
    return StateSectionEmployee(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
