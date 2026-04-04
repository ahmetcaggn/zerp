import 'package:flutter_test/flutter_test.dart';
import 'package:zerp_tenant/main.dart';

void main() {
  testWidgets('renders splash title', (tester) async {
    await tester.pumpWidget(const MyApp());
    await tester.pumpAndSettle();

    expect(find.text('Zerp Tenant'), findsOneWidget);
  });
}
