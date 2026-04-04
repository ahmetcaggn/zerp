import 'package:equatable/equatable.dart';

class StateSectionStore extends Equatable {
  const StateSectionStore({this.isLoading = false});

  final bool isLoading;

  StateSectionStore copyWith({bool? isLoading}) {
    return StateSectionStore(isLoading: isLoading ?? this.isLoading);
  }

  @override
  List<Object?> get props => [isLoading];
}
