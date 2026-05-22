import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/settings/sections/api_baseurl/cubit_settings_api_baseurl.dart';
import 'package:zerp_tenant/product/config/injectable/init_injectable.dart';
import 'package:zerp_tenant/product/service/api_status/model/actuator_status.dart';
import 'package:zerp_tenant/product/ui/layout/app_scaffold.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenSettingsApiBaseUrl extends StatefulWidget {
  const ScreenSettingsApiBaseUrl({super.key});

  @override
  State<ScreenSettingsApiBaseUrl> createState() =>
      _ScreenSettingsApiBaseUrlState();
}

class _ScreenSettingsApiBaseUrlState extends State<ScreenSettingsApiBaseUrl> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _urlController;

  @override
  void initState() {
    super.initState();
    _urlController = TextEditingController();
  }

  @override
  void dispose() {
    _urlController.dispose();
    super.dispose();
  }

  bool _isValidUrl(String? value) {
    if (value == null || value.trim().isEmpty) return false;
    final uri = Uri.tryParse(value.trim());
    return uri != null && (uri.scheme == 'http' || uri.scheme == 'https');
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<CubitSettingsApiBaseUrl>(),
      child: BlocConsumer<CubitSettingsApiBaseUrl, StateSettingsApiBaseUrl>(
        listener: (context, state) {
          if (_urlController.text.isEmpty && state.currentApiHost.isNotEmpty) {
            _urlController.text = state.currentApiHost;
          }
        },
        builder: (context, state) {
          final t = context.t;

          return AppScaffold(
            title: t.settings.apiUrlTitle,
            body: Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 24,
                ),
                children: [
                  _ActiveApiHostCard(
                    currentApiHost: state.currentApiHost,
                    isChecking: state.isCheckingApiStatus,
                    status: state.apiStatus,
                  ),
                  const SizedBox(height: 32),
                  _PredefinedUrlSelector(
                    predefinedUrls: state.predefinedUrls,
                    urlController: _urlController,
                    onUrlSelected: (url) {
                      setState(() {
                        _urlController.text = url;
                      });
                    },
                  ),
                  const SizedBox(height: 32),
                  _CustomUrlTextField(
                    urlController: _urlController,
                    onChanged: (_) => setState(() {}),
                    validator: _isValidUrl,
                  ),
                  const SizedBox(height: 40),
                  _SaveButton(
                    isLoading: state.isLoading,
                    onPressed: () async {
                      if (_formKey.currentState?.validate() ?? false) {
                        final cubit = context.read<CubitSettingsApiBaseUrl>();
                        final targetUrl = _urlController.text.trim();
                        await cubit.saveSettings(targetUrl);

                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(t.settings.saveSuccess),
                              backgroundColor: Colors.green,
                              behavior: SnackBarBehavior.floating,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                          );
                        }
                      }
                    },
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _ActiveApiHostCard extends StatelessWidget {
  const _ActiveApiHostCard({
    required this.currentApiHost,
    required this.isChecking,
    required this.status,
  });

  final String currentApiHost;
  final bool isChecking;
  final ActuatorStatus status;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;

    return Card(
      elevation: 4,
      shadowColor: theme.colorScheme.primary.withAlpha(50),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      clipBehavior: Clip.antiAlias,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              theme.colorScheme.primary,
              theme.colorScheme.primaryContainer,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.cloud_sync_rounded,
                  color: theme.colorScheme.onPrimary,
                  size: 28,
                ),
                const SizedBox(width: 12),
                Text(
                  t.settings.activeUrl,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: theme.colorScheme.onPrimary.withAlpha(200),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SelectableText(
              currentApiHost.isEmpty ? '...' : currentApiHost,
              style: theme.textTheme.headlineSmall?.copyWith(
                color: theme.colorScheme.onPrimary,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                if (isChecking) ...[
                  const SizedBox(
                    width: 12,
                    height: 12,
                    child: CircularProgressIndicator(
                      strokeWidth: 1.5,
                      valueColor: AlwaysStoppedAnimation(Colors.white70),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    t.settings.statusChecking,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onPrimary.withAlpha(180),
                    ),
                  ),
                ] else ...[
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: status == ActuatorStatus.up
                          ? Colors.greenAccent
                          : status == ActuatorStatus.down ||
                                status == ActuatorStatus.outOfService
                          ? Colors.redAccent
                          : Colors.orangeAccent,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    status == ActuatorStatus.up
                        ? t.settings.statusConnected
                        : status == ActuatorStatus.down ||
                              status == ActuatorStatus.outOfService
                        ? t.settings.statusDisconnected
                        : t.settings.statusUnknown,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onPrimary.withAlpha(180),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _PredefinedUrlSelector extends StatelessWidget {
  const _PredefinedUrlSelector({
    required this.predefinedUrls,
    required this.urlController,
    required this.onUrlSelected,
  });

  final List<String> predefinedUrls;
  final TextEditingController urlController;
  final ValueChanged<String> onUrlSelected;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          t.settings.predefinedUrls,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        if (predefinedUrls.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Text(
              t.settings.noPredefined,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.disabledColor,
              ),
            ),
          )
        else
          DropdownButtonFormField<String>(
            key: ValueKey(urlController.text.trim()),
            initialValue: predefinedUrls.contains(urlController.text.trim())
                ? urlController.text.trim()
                : null,
            decoration: InputDecoration(
              prefixIcon: const Icon(Icons.dns_rounded),
              labelText: t.settings.predefinedUrls,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            items: predefinedUrls.map((url) {
              return DropdownMenuItem<String>(
                value: url,
                child: Text(
                  url,
                  overflow: TextOverflow.ellipsis,
                ),
              );
            }).toList(),
            onChanged: (val) {
              if (val != null) {
                onUrlSelected(val);
              }
            },
          ),
      ],
    );
  }
}

class _CustomUrlTextField extends StatelessWidget {
  const _CustomUrlTextField({
    required this.urlController,
    required this.onChanged,
    required this.validator,
  });

  final TextEditingController urlController;
  final ValueChanged<String> onChanged;
  final bool Function(String?) validator;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          t.settings.apiUrlTitle,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          t.settings.apiUrlSubtitle,
          style: theme.textTheme.bodySmall?.copyWith(
            color: theme.textTheme.bodySmall?.color?.withAlpha(180),
          ),
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: urlController,
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.link_rounded),
            labelText: t.settings.customUrl,
            hintText: t.settings.customUrlHint,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            suffixIcon: urlController.text.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear_rounded),
                    onPressed: () {
                      urlController.clear();
                      onChanged('');
                    },
                  )
                : null,
          ),
          keyboardType: TextInputType.url,
          autocorrect: false,
          onChanged: onChanged,
          validator: (val) => validator(val) ? null : t.settings.invalidUrl,
        ),
      ],
    );
  }
}

class _SaveButton extends StatelessWidget {
  const _SaveButton({
    required this.isLoading,
    required this.onPressed,
  });

  final bool isLoading;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = context.t;

    return SizedBox(
      height: 56,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: theme.colorScheme.primary,
          foregroundColor: theme.colorScheme.onPrimary,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 2,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.save_rounded),
            const SizedBox(width: 12),
            Text(
              t.common.save,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            if (isLoading) ...[
              const SizedBox(width: 16),
              const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation(Colors.white),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
