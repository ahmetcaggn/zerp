import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http_test_server/http_test_server.dart';
import 'package:openapi_employee/api.dart';

void main() {
  group('', () {
    test('employee response convert test', () async {
      final server = await TestServer.createHttpServer(
        events: [
          StandardServerEvent(
            matcher: (_) => true,
            handler: (request) async {
              return '''
              {
                "success": true,
                "statusCode": 200,
                "message": "Success",
                "data": {
                    "contacts": [],
                    "createdAt": "2026-05-12T21:37:19.417368115",
                    "dateOfBirth": null,
                    "email": "deneme_1@mail.com",
                    "firstName": "string",
                    "hireDate": "2026-05-12",
                    "id": "37bcbc9b-02f6-4a17-84ff-6c8b412ef51a",
                    "lastName": "strin",
                    "manager": null,
                    "nationalId": null,
                    "phoneNumber": null,
                    "salary": null,
                    "status": null,
                    "terminationDate": null,
                    "updatedAt": "2026-05-12T21:37:19.417368115"
                },
                "meta": {
                    "traceId": "35e07151-e609-432b-9c2c-ab5efb9774f7",
                    "durationMs": 574,
                    "version": "0.0.1-SNAPSHOT",
                    "timestamp": "2026-05-12T21:37:19.466299398Z"
                }
              }
              ''';
            },
          ),
        ],
      );

      final url = server.url();
      final invoker = DioNetworkInvoker.fromBaseUrl(url);
      final request = CreateEmployeeCommand(
        createEmployeeRequestDto: CreateEmployeeRequestDto(
          firstName: 'string',
          lastName: 'string',
          email: 'asdf@asdf.com',
          hireDate: DateTime(2026, 5, 12),
          username: 'asdf',
          tempPassword: 'asdfasdf',
        ),
      );

      final result = await invoker.send(request);

      switch (result) {
        case SuccessResponseResult<ApiResponseEmployeeResponseDto>():
          final employee = result.data.data;
          expect(employee?.id, '37bcbc9b-02f6-4a17-84ff-6c8b412ef51a');

        case NetworkErrorResult<ApiResponseEmployeeResponseDto>():
          fail('Network error: ${result.error}\n${result.error.stackTrace}');
        case SpecifiedResponseResult<ApiResponseEmployeeResponseDto>():
          fail('Unsuccessful response: ${result.statusCode}');
      }
    });
  });
}
