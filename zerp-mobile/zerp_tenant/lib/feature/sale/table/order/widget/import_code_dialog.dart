import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class ImportCodeDialog extends StatefulWidget {
  const ImportCodeDialog({super.key});

  static Future<String?> show(BuildContext context) {
    return showDialog<String>(
      context: context,
      builder: (context) => const ImportCodeDialog(),
    );
  }

  @override
  State<ImportCodeDialog> createState() => _ImportCodeDialogState();
}

class _ImportCodeDialogState extends State<ImportCodeDialog> {
  final TextEditingController _codeController = TextEditingController();
  bool _isScanning = false;
  final MobileScannerController _scannerController = MobileScannerController();

  @override
  Future<void> dispose() async {
    _codeController.dispose();
    await _scannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isScanning) {
      return Dialog(
        insetPadding: const EdgeInsets.all(16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: SizedBox(
            width: double.infinity,
            height: 450,
            child: Stack(
              children: [
                MobileScanner(
                  controller: _scannerController,
                  onDetect: (capture) {
                    final barcodes = capture.barcodes;
                    if (barcodes.isNotEmpty) {
                      final code = barcodes.first.rawValue;
                      if (code != null) {
                        Navigator.of(context).pop(code);
                      }
                    }
                  },
                ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: CircleAvatar(
                    backgroundColor: Colors.black54,
                    child: IconButton(
                      icon: const Icon(Icons.close, color: Colors.white),
                      onPressed: () {
                        setState(() {
                          _isScanning = false;
                        });
                      },
                    ),
                  ),
                ),
                Positioned(
                  bottom: 24,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        t.sale.order.importDialog.alignQr,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: Text(t.sale.order.importDialog.title),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _codeController,
            decoration: InputDecoration(
              hintText: t.sale.order.importDialog.hint,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16),
            ),
          ),
          const SizedBox(height: 16),
          Center(
            child: Text(
              t.sale.order.importDialog.or,
              style: const TextStyle(
                color: Colors.grey,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 16),
          OutlinedButton.icon(
            onPressed: () {
              setState(() {
                _isScanning = true;
              });
            },
            icon: const Icon(Icons.camera_alt),
            label: Text(t.sale.order.importDialog.scanQrButton),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text(t.sale.order.importDialog.cancel),
        ),
        ElevatedButton(
          onPressed: () {
            if (_codeController.text.trim().isNotEmpty) {
              Navigator.of(context).pop(_codeController.text.trim());
            }
          },
          child: Text(t.sale.order.importDialog.ok),
        ),
      ],
    );
  }
}
