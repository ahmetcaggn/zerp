import 'package:path_provider/path_provider.dart';
import 'package:sembast/sembast_io.dart';

abstract final class StorageInitializer {
  static late final Database database;
  static final StoreRef<String, Map<String, dynamic>> store =
      stringMapStoreFactory.store('zerp_store');

  static Future<void> initialize() async {
    final appDirectory = await getApplicationDocumentsDirectory();
    final databasePath = '${appDirectory.path}/zerp_tenant.db';
    database = await databaseFactoryIo.openDatabase(databasePath);
  }
}
