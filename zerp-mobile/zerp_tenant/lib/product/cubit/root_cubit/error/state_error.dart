import 'package:equatable/equatable.dart';

final class StateError extends Equatable {
  const StateError(this.messages);

  final List<String> messages;

  @override
  List<Object?> get props => [messages];

  @override
  String toString() {
    return 'StateError(messages: $messages)';
  }
}
