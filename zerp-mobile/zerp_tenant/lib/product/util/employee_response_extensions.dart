import 'package:openapi_employee/api.dart';

extension EmployeeListResponseExtension on EmployeeListResponseDto {
  String get fullName {
    if (firstName != null && lastName != null) {
      return '$firstName $lastName';
    } else if (firstName != null) {
      return firstName!;
    } else if (lastName != null) {
      return lastName!;
    } else {
      return '';
    }
  }

  String get presentableName {
    return '$username ($fullName)';
  }
}

extension EmployeeResponseExtension on EmployeeResponseDto {
  String get fullName {
    if (firstName != null && lastName != null) {
      return '$firstName $lastName';
    } else if (firstName != null) {
      return firstName!;
    } else if (lastName != null) {
      return lastName!;
    } else {
      return '';
    }
  }

  String get presentableName {
    return '$username ($fullName)';
  }
}
