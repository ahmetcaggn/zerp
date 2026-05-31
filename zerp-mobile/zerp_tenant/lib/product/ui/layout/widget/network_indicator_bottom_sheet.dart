import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/network_indicator/cubit_network_indicator.dart';

/// Bottom sheet that shows all HTTP requests grouped into two sections:
///
/// - **In Progress** — live rows with a [LinearProgressIndicator].
/// - **Completed** — history rows with a status icon and duration.
///
/// The widget subscribes to [CubitNetworkIndicator] so it updates in real-time
/// while the sheet is open.
class NetworkIndicatorBottomSheet extends StatelessWidget {
  const NetworkIndicatorBottomSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CubitNetworkIndicator, StateNetworkIndicator>(
      builder: (context, state) {
        final data = state as StateNetworkIndicatorData;
        return _NetworkIndicatorSheetContent(data: data);
      },
    );
  }
}

// ---------------------------------------------------------------------------
// Sheet layout
// ---------------------------------------------------------------------------

class _NetworkIndicatorSheetContent extends StatelessWidget {
  const _NetworkIndicatorSheetContent({required this.data});

  final StateNetworkIndicatorData data;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return DraggableScrollableSheet(
      initialChildSize: 0.6,
      minChildSize: 0.3,
      maxChildSize: 0.9,
      expand: false,
      builder: (context, scrollController) {
        return Column(
          children: [
            // Drag handle
            Padding(
              padding: const EdgeInsets.only(top: 12, bottom: 4),
              child: Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: colorScheme.outlineVariant,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            // Header row
            Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Icon(
                    Icons.network_check_rounded,
                    color: colorScheme.primary,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Network Requests',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  if (data.completed.isNotEmpty)
                    TextButton.icon(
                      onPressed: () =>
                          context.read<CubitNetworkIndicator>().clearHistory(),
                      icon: const Icon(Icons.delete_sweep_outlined, size: 16),
                      label: const Text('Clear'),
                      style: TextButton.styleFrom(
                        foregroundColor: colorScheme.error,
                        visualDensity: VisualDensity.compact,
                      ),
                    ),
                ],
              ),
            ),
            const Divider(height: 1),
            // Scrollable body
            Expanded(
              child: ListView(
                controller: scrollController,
                padding: const EdgeInsets.only(bottom: 24),
                children: [
                  _SectionHeader(
                    label: 'In Progress',
                    count: data.inProgress.length,
                    color: colorScheme.primary,
                  ),
                  if (data.inProgress.isEmpty)
                    const _EmptyRow(message: 'No active requests')
                  else
                    ...data.inProgress.map(
                      (p) => _InProgressTile(progress: p),
                    ),
                  _SectionHeader(
                    label: 'Completed',
                    count: data.completed.length,
                    color: colorScheme.secondary,
                  ),
                  if (data.completed.isEmpty)
                    const _EmptyRow(message: 'No completed requests yet')
                  else
                    ...data.completed.map(
                      (e) => _CompletedTile(entry: e),
                    ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}

// ---------------------------------------------------------------------------
// Section header
// ---------------------------------------------------------------------------

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({
    required this.label,
    required this.count,
    required this.color,
  });

  final String label;
  final int count;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
      child: Row(
        children: [
          Text(
            label.toUpperCase(),
            style: theme.textTheme.labelSmall?.copyWith(
              color: color,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(width: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              '$count',
              style: theme.textTheme.labelSmall?.copyWith(
                color: color,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Empty row
// ---------------------------------------------------------------------------

class _EmptyRow extends StatelessWidget {
  const _EmptyRow({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Text(
        message,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: Theme.of(context).colorScheme.outline,
            ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// In-progress tile
// ---------------------------------------------------------------------------

class _InProgressTile extends StatelessWidget {
  const _InProgressTile({required this.progress});

  final RequestProgressState progress;

  String get _methodAndPath {
    final req = progress.request;
    return '${req.method.name.toUpperCase()}  ${req.path}';
  }

  String get _statusLabel {
    return switch (progress.status) {
      ProgressStatus.pending => 'Pending',
      ProgressStatus.sending => 'Sending…',
      ProgressStatus.receiving => 'Receiving…',
      _ => progress.status.name,
    };
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Card(
        elevation: 0,
        color: colorScheme.primaryContainer.withValues(alpha: 0.4),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.sync_rounded,
                    size: 14,
                    color: colorScheme.primary,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      _methodAndPath,
                      style: theme.textTheme.bodySmall?.copyWith(
                        fontFamily: 'monospace',
                        fontWeight: FontWeight.w600,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    _statusLabel,
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: colorScheme.primary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              LinearProgressIndicator(
                value: progress.unknownTotal ? null : progress.progressPercent,
                borderRadius: BorderRadius.circular(4),
                minHeight: 4,
                backgroundColor: colorScheme.primaryContainer,
                color: colorScheme.primary,
              ),
              if (!progress.unknownTotal && progress.total > 0) ...[
                const SizedBox(height: 4),
                Text(
                  '${_formatBytes(progress.progress)} / ${_formatBytes(progress.total)}',
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: colorScheme.outline,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Completed tile
// ---------------------------------------------------------------------------

class _CompletedTile extends StatelessWidget {
  const _CompletedTile({required this.entry});

  final RequestHistoryEntry entry;

  String get _methodAndPath {
    final req = entry.request;
    return '${req.method.name.toUpperCase()}  ${req.path}';
  }

  ({IconData icon, Color Function(ColorScheme cs) color, String label})
      get _statusInfo {
    return switch (entry.status) {
      ProgressStatus.success => (
          icon: Icons.check_circle_outline_rounded,
          color: (ColorScheme cs) => cs.tertiary,
          label: 'Success',
        ),
      ProgressStatus.unsuccessful => (
          icon: Icons.warning_amber_rounded,
          color: (ColorScheme cs) => cs.error,
          label: 'Unsuccessful',
        ),
      ProgressStatus.error => (
          icon: Icons.error_outline_rounded,
          color: (ColorScheme cs) => cs.error,
          label: 'Error',
        ),
      ProgressStatus.cancelled => (
          icon: Icons.cancel_outlined,
          color: (ColorScheme cs) => cs.outline,
          label: 'Cancelled',
        ),
      // Non-terminal statuses won't appear in history, but handle exhaustively.
      _ => (
          icon: Icons.help_outline_rounded,
          color: (ColorScheme cs) => cs.outline,
          label: entry.status.name,
        ),
    };
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final info = _statusInfo;
    final iconColor = info.color(colorScheme);
    final durationMs = entry.duration.inMilliseconds;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Card(
        elevation: 0,
        color: colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 8, 12, 8),
          child: Row(
            children: [
              Icon(info.icon, size: 18, color: iconColor),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _methodAndPath,
                      style: theme.textTheme.bodySmall?.copyWith(
                        fontFamily: 'monospace',
                        fontWeight: FontWeight.w500,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${info.label} · ${durationMs}ms',
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: colorScheme.outline,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

String _formatBytes(int bytes) {
  if (bytes < 1024) return '${bytes}B';
  if (bytes < 1024 * 1024) {
    return '${(bytes / 1024).toStringAsFixed(1)}KB';
  }
  return '${(bytes / (1024 * 1024)).toStringAsFixed(1)}MB';
}
