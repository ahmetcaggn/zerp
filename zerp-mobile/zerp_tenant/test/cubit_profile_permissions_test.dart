import 'package:flutter_test/flutter_test.dart';
import 'package:openapi_user/api.dart';
import 'package:zerp_tenant/feature/profile/permission/cubit_profile_permissions.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';

class FakePermissionService implements PermissionService {
  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}

void main() {
  group('CubitProfilePermissions - filterPermissions', () {
    late List<PermissionResponse> mockPermissions;
    late PermissionService fakePermissionService;

    setUp(() {
      fakePermissionService = FakePermissionService();
      mockPermissions = [
        PermissionResponse(
          id: 1,
          action: PermissionResponseActionEnum.CREATE_EMPLOYEE,
          targetType: PermissionResponseTargetTypeEnum.EMPLOYEE,
          targetId: '123',
        ),
        PermissionResponse(
          id: 2,
          action: PermissionResponseActionEnum.READ_USER,
          targetType: PermissionResponseTargetTypeEnum.USER,
          targetId: 'abc',
        ),
        PermissionResponse(
          id: 3,
        ),
        PermissionResponse(
          id: 4,
          action: PermissionResponseActionEnum.UPDATE_TICKET,
          targetType: PermissionResponseTargetTypeEnum.TICKET,
          targetId: '456',
        ),
      ];
    });

    test('empty or whitespace query resets to all permissions', () {
      final cubit = CubitProfilePermissions(fakePermissionService);
      final initialState = StateProfilePermissionsLoaded(
        permissions: mockPermissions,
        totalCount: mockPermissions.length,
        filteredPermissions: const [],
        filterQuery: 'old_query',
      );

      cubit
        ..emit(initialState)
        ..filterPermissions('');

      expect(cubit.state, isA<StateProfilePermissionsLoaded>());
      var state = cubit.state as StateProfilePermissionsLoaded;
      expect(state.filteredPermissions, mockPermissions);
      expect(state.filterQuery, '');

      cubit.filterPermissions('   ');
      state = cubit.state as StateProfilePermissionsLoaded;
      expect(state.filteredPermissions, mockPermissions);
      expect(state.filterQuery, '');
    });

    test('case-insensitive matching works', () {
      final cubit = CubitProfilePermissions(fakePermissionService);
      final initialState = StateProfilePermissionsLoaded(
        permissions: mockPermissions,
        totalCount: mockPermissions.length,
        filteredPermissions: mockPermissions,
      );

      cubit
        ..emit(initialState)
        ..filterPermissions('create_employee');

      var state = cubit.state as StateProfilePermissionsLoaded;
      expect(state.filteredPermissions.length, 1);
      expect(state.filteredPermissions[0].id, 1);

      cubit.filterPermissions('CREATE_EMPLOYEE');
      state = cubit.state as StateProfilePermissionsLoaded;
      expect(state.filteredPermissions.length, 1);
      expect(state.filteredPermissions[0].id, 1);
    });

    test('matching on action, targetType, or targetId works', () {
      final cubit = CubitProfilePermissions(fakePermissionService);
      final initialState = StateProfilePermissionsLoaded(
        permissions: mockPermissions,
        totalCount: mockPermissions.length,
        filteredPermissions: mockPermissions,
      );

      cubit
        ..emit(initialState)
        ..filterPermissions('READ_USER');

      var state = cubit.state as StateProfilePermissionsLoaded;
      expect(state.filteredPermissions.length, 1);
      expect(state.filteredPermissions[0].id, 2);

      cubit.filterPermissions('TICKET');
      state = cubit.state as StateProfilePermissionsLoaded;
      expect(state.filteredPermissions.length, 1);
      expect(state.filteredPermissions[0].id, 4);

      cubit.filterPermissions('abc');
      state = cubit.state as StateProfilePermissionsLoaded;
      expect(state.filteredPermissions.length, 1);
      expect(state.filteredPermissions[0].id, 2);
    });

    test('multi-term queries (space-separated) '
        'match across different fields', () {
      final cubit = CubitProfilePermissions(fakePermissionService);
      final initialState = StateProfilePermissionsLoaded(
        permissions: mockPermissions,
        totalCount: mockPermissions.length,
        filteredPermissions: mockPermissions,
      );

      cubit
        ..emit(initialState)
        ..filterPermissions('create 123');

      var state = cubit.state as StateProfilePermissionsLoaded;
      expect(state.filteredPermissions.length, 1);
      expect(state.filteredPermissions[0].id, 1);

      cubit.filterPermissions('read user');
      state = cubit.state as StateProfilePermissionsLoaded;
      expect(state.filteredPermissions.length, 1);
      expect(state.filteredPermissions[0].id, 2);

      cubit.filterPermissions('ticket xyz');
      state = cubit.state as StateProfilePermissionsLoaded;
      expect(state.filteredPermissions, isEmpty);
    });

    test('null-safe fields do not throw and match correctly', () {
      final cubit = CubitProfilePermissions(fakePermissionService);
      final initialState = StateProfilePermissionsLoaded(
        permissions: mockPermissions,
        totalCount: mockPermissions.length,
        filteredPermissions: mockPermissions,
      );

      cubit
        ..emit(initialState)
        ..filterPermissions('anything');

      expect(cubit.state, isA<StateProfilePermissionsLoaded>());

      cubit.filterPermissions('abc');
      final state = cubit.state as StateProfilePermissionsLoaded;
      expect(state.filteredPermissions.any((p) => p.id == 3), isFalse);
    });
  });
}
