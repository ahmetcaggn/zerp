import 'package:equatable/equatable.dart';

class StateDashboard extends Equatable {
  const StateDashboard({
    required this.count,
  });

  final int count;

  @override
  List<Object?> get props => [count];

  StateDashboard copyWith({int? count}) {
    return StateDashboard(count: count ?? this.count);
  }
}
