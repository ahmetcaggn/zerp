import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:openapi_resource/api.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_counts.dart';
import 'package:zerp_tenant/feature/stock/view/widgets/stock_count_entry_sheet.dart';
import 'package:zerp_tenant/feature/stock/view/widgets/stock_count_form_sheet.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class StockCountsTab extends StatefulWidget {
  const StockCountsTab({
    required this.shopId,
    super.key,
  });

  final String shopId;

  @override
  State<StockCountsTab> createState() => _StockCountsTabState();
}

class _StockCountsTabState extends State<StockCountsTab> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await context.read<CubitStockCounts>().load(shopId: widget.shopId);
    });
  }

  Future<void> _openCreateForm() async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (_) => BlocProvider.value(
        value: context.read<CubitStockCounts>(),
        child: StockCountFormSheet(shopId: widget.shopId),
      ),
    );
  }

  Future<void> _openEntrySheet(StockCountDTO count) async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (_) => BlocProvider.value(
        value: context.read<CubitStockCounts>(),
        child: StockCountEntrySheet(count: count, shopId: widget.shopId),
      ),
    );
  }

  Future<void> _approve(BuildContext context, StockCountDTO count) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) {
        final desc =
            '${count.shopName ?? ''} —'
            ' ${DateFormat.yMd().format(count.countDate ?? DateTime.now())}';

        return AlertDialog(
          title: Text(context.t.stock.count.approve),
          content: Text(desc),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(false),
              child: Text(context.t.common.cancel),
            ),
            FilledButton(
              onPressed: () => Navigator.of(ctx).pop(true),
              child: Text(context.t.stock.count.approve),
            ),
          ],
        );
      },
    );
    if (confirmed != true || !context.mounted) return;
    await context.read<CubitStockCounts>().approveCount(
      id: count.id!,
      shopId: widget.shopId,
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t.stock;

    return Stack(
      children: [
        BlocBuilder<CubitStockCounts, StateStockCounts>(
          builder: (context, state) {
            if (state is StateStockCountsLoading) {
              return const Center(child: CircularProgressIndicator());
            }
            if (state is StateStockCountsError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(state.message),
                    const SizedBox(height: 8),
                    FilledButton(
                      onPressed: () => context.read<CubitStockCounts>().load(
                        shopId: widget.shopId,
                      ),
                      child: Text(context.t.common.retry),
                    ),
                  ],
                ),
              );
            }
            if (state is StateStockCountsLoaded) {
              if (state.counts.isEmpty) {
                return Center(child: Text(t.count.emptyState));
              }

              return ListView.separated(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 80),
                itemCount: state.counts.length,
                separatorBuilder: (_, _) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final count = state.counts[index];
                  final status = count.status?.value ?? '';
                  final statusLabel =
                      (context.t['stock.count.statuses.$status'] as String?) ??
                      status;
                  final isActionable =
                      status == 'DRAFT' || status == 'IN_PROGRESS';
                  final isApprovable = status == 'READY_FOR_APPROVAL';

                  return Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(
                        color: Theme.of(context).colorScheme.outlineVariant,
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  count.countDate != null
                                      ? DateFormat.yMMMd().format(
                                          count.countDate!,
                                        )
                                      : '',
                                  style: Theme.of(context).textTheme.titleSmall
                                      ?.copyWith(fontWeight: FontWeight.bold),
                                ),
                              ),
                              _StatusBadge(status: status, label: statusLabel),
                            ],
                          ),
                          if (count.notes?.isNotEmpty ?? false)
                            Padding(
                              padding: const EdgeInsets.only(top: 4),
                              child: Text(
                                count.notes!,
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                            ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              if (isActionable)
                                OutlinedButton(
                                  onPressed: () => _openEntrySheet(count),
                                  child: Text(t.count.enterCount),
                                ),
                              if (isApprovable)
                                FilledButton(
                                  onPressed: () => _approve(context, count),
                                  child: Text(t.count.approve),
                                ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              );
            }
            return const SizedBox.shrink();
          },
        ),

        // FAB
        Positioned(
          bottom: 16 + MediaQuery.paddingOf(context).bottom,
          right: 16,
          child: FloatingActionButton.extended(
            onPressed: _openCreateForm,
            icon: const Icon(Icons.add),
            label: Text(t.count.createButton),
          ),
        ),
      ],
    );
  }
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.status, required this.label});

  final String status;
  final String label;

  @override
  Widget build(BuildContext context) {
    final color = switch (status) {
      'COMPLETED' => Colors.green,
      'READY_FOR_APPROVAL' => Colors.blue,
      'IN_PROGRESS' => Colors.orange,
      'CANCELLED' => Colors.red,
      _ => Theme.of(context).colorScheme.secondary,
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        label,
        style: Theme.of(context).textTheme.labelSmall?.copyWith(color: color),
      ),
    );
  }
}
