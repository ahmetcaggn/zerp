/// Represents the standard status values returned by Spring Boot Actuator.
enum ActuatorStatus {
  up('UP'),
  down('DOWN'),
  outOfService('OUT_OF_SERVICE'),
  unknown('UNKNOWN')
  ;

  const ActuatorStatus(this.value);

  final String value;

  /// Safely parses a string into an [ActuatorStatus].
  static ActuatorStatus fromString(String? status) {
    if (status == null) return ActuatorStatus.unknown;
    return ActuatorStatus.values.firstWhere(
      (e) => e.value == status.toUpperCase(),
      orElse: () => ActuatorStatus.unknown,
    );
  }

  /// Helper getter if you just need a quick boolean check
  bool get isUp => this == ActuatorStatus.up;
}
