import 'package:equatable/equatable.dart';

/// Types of messages that can be shown in the app scaffold message bar.
enum AppMessageType {
  /// Informational message (blue)
  info,

  /// Success message (green)
  success,

  /// Warning message (orange)
  warning,

  /// Error message (red)
  error,
}

/// An individual message to be presented in the app scaffold message bar.
final class AppMessage extends Equatable {
  const AppMessage({
    required this.id,
    required this.message,
    this.type = AppMessageType.info,
    this.duration = const Duration(seconds: 4),
  });

  /// Unique identifier used for removal.
  final String id;

  /// The text content of the message.
  final String message;

  /// Visual style of the message.
  final AppMessageType type;

  /// How long the message stays visible before auto-dismissing.
  final Duration duration;

  @override
  List<Object?> get props => [id, message, type, duration];

  @override
  String toString() =>
      'AppMessage(id: $id, type: $type, message: $message)';
}

/// State emitted by the app messenger cubit.
final class StateAppMessenger extends Equatable {
  const StateAppMessenger(this.messages);

  /// Currently visible messages, in insertion order.
  final List<AppMessage> messages;

  @override
  List<Object?> get props => [messages];

  @override
  String toString() => 'StateAppMessenger(messages: $messages)';
}
