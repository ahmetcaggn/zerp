// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format width=80

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:flutter_appauth/flutter_appauth.dart' as _i337;
import 'package:flutter_secure_storage/flutter_secure_storage.dart' as _i558;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;

import '../../../feature/profile/cubit/cubit_profile.dart' as _i477;
import '../../../feature/profile/cubit/permission/cubit_profile_permissions.dart'
    as _i170;
import '../../cubit/root_cubit/auth/cubit_auth.dart' as _i200;
import '../../cubit/root_cubit/error/cubit_error.dart' as _i139;
import '../../navigation/app_route.dart' as _i795;
import '../../navigation/auth_guard.dart' as _i84;
import '../../network/network_manager.dart' as _i475;
import '../../service/auth/auth_service.dart' as _i238;
import '../../service/auth/auth_storage_service.dart' as _i40;
import '../../service/user/permission_service.dart' as _i545;
import '../../storage/operator/auth_claims.operator.dart' as _i301;
import '../../storage/operator/auth_token.operator.dart' as _i145;
import '../../storage/operator/device_id.operator.dart' as _i447;
import '../device_id_generator.dart' as _i600;
import 'module/service_module.dart' as _i387;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    final serviceModule = _$ServiceModule();
    gh.factory<_i477.CubitProfile>(() => _i477.CubitProfile());
    gh.factory<_i301.AuthClaimsOperator>(() => _i301.AuthClaimsOperator());
    gh.factory<_i447.DeviceIdOperator>(() => _i447.DeviceIdOperator());
    gh.lazySingleton<_i337.FlutterAppAuth>(() => serviceModule.appAuth);
    gh.lazySingleton<_i558.FlutterSecureStorage>(
      () => serviceModule.secureStorage,
    );
    gh.lazySingleton<_i139.CubitError>(() => _i139.CubitError());
    gh.factory<_i600.DeviceIdGenerator>(
      () => _i600.DeviceIdGenerator(gh<_i447.DeviceIdOperator>()),
    );
    gh.factory<_i145.AuthTokenOperator>(
      () => _i145.AuthTokenOperator(gh<_i558.FlutterSecureStorage>()),
    );
    gh.factory<_i40.AuthStorageService>(
      () => _i40.AuthStorageService(
        gh<_i145.AuthTokenOperator>(),
        gh<_i301.AuthClaimsOperator>(),
      ),
    );
    gh.factory<_i238.AuthService>(
      () => _i238.AuthService(
        gh<_i337.FlutterAppAuth>(),
        gh<_i40.AuthStorageService>(),
      ),
    );
    gh.lazySingleton<_i200.CubitAuth>(
      () => _i200.CubitAuth(
        gh<_i238.AuthService>(),
        gh<_i40.AuthStorageService>(),
      ),
    );
    gh.factory<_i475.NetworkManager>(
      () => _i475.NetworkManager(
        gh<_i200.CubitAuth>(),
        gh<_i40.AuthStorageService>(),
      ),
    );
    gh.factory<_i84.AuthGuard>(
      () => _i84.AuthGuard(
        gh<_i40.AuthStorageService>(),
        gh<_i238.AuthService>(),
      ),
    );
    gh.factory<_i545.PermissionService>(
      () => _i545.PermissionService(
        networkManager: gh<_i475.NetworkManager>(),
        authStorageService: gh<_i40.AuthStorageService>(),
        cubitError: gh<_i139.CubitError>(),
        cubitAuth: gh<_i200.CubitAuth>(),
      ),
    );
    gh.factory<_i170.CubitProfilePermissions>(
      () => _i170.CubitProfilePermissions(gh<_i545.PermissionService>()),
    );
    gh.singleton<_i795.AppRoute>(() => _i795.AppRoute(gh<_i84.AuthGuard>()));
    return this;
  }
}

class _$ServiceModule extends _i387.ServiceModule {}
