import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:openapi_resource/api.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_operations.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_resources.dart';
import 'package:zerp_tenant/feature/stock/view/widgets/stock_adjustment_form_sheet.dart';
import 'package:zerp_tenant/feature/stock/view/widgets/stock_entry_form_sheet.dart';
import 'package:zerp_tenant/feature/stock/view/widgets/stock_operation_detail_sheet.dart';
import 'package:zerp_tenant/feature/stock/view/widgets/stock_resource_form_sheet.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class StockResourceTab extends StatefulWidget {
  const StockResourceTab({
    required this.shopId,
    super.key,
  });

  final String shopId;

  @override
  State<StockResourceTab> createState() => _StockResourceTabState();
}

class _StockResourceTabState extends State<StockResourceTab> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final cubitResources = context.read<CubitStockResources>();
      final cubitOperations = context.read<CubitStockOperations>();
      await cubitResources.load(shopId: widget.shopId);
      await cubitOperations.loadHistory(
        shopId: widget.shopId,
      );
    });
  }

  Future<void> _openResourceForm({StockResourceDTO? resource}) async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (_) => BlocProvider.value(
        value: context.read<CubitStockResources>(),
        child: StockResourceFormSheet(
          shopId: widget.shopId,
          initialData: resource,
        ),
      ),
    );
  }

  Future<void> _openEntryForm() async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (_) => MultiBlocProvider(
        providers: [
          BlocProvider.value(value: context.read<CubitStockResources>()),
          BlocProvider.value(value: context.read<CubitStockOperations>()),
        ],
        child: StockEntryFormSheet(shopId: widget.shopId),
      ),
    );
  }

  Future<void> _openAdjustmentForm() async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (_) => MultiBlocProvider(
        providers: [
          BlocProvider.value(value: context.read<CubitStockResources>()),
          BlocProvider.value(value: context.read<CubitStockOperations>()),
        ],
        child: StockAdjustmentFormSheet(shopId: widget.shopId),
      ),
    );
  }

  Future<void> _openOperationDetail(StockOperationDTO operation) async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (_) => StockOperationDetailSheet(operation: operation),
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t.stock;

    return BlocBuilder<CubitStockResources, StateStockResources>(
      builder: (context, state) {
        return CustomScrollView(
          slivers: [
            // Action buttons
            SliverAppBar(
              floating: true,
              automaticallyImplyLeading: false,
              toolbarHeight: 48,
              backgroundColor: Theme.of(context).scaffoldBackgroundColor,
              surfaceTintColor: Theme.of(context).scaffoldBackgroundColor,
              shadowColor: Theme.of(
                context,
              ).colorScheme.onSurface.withValues(alpha: 0.3),
              titleSpacing: 0,
              title: Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                child: SizedBox(
                  height: 48,
                  width: double.infinity,
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    reverse: true,
                    child: Row(
                      children: [
                        OutlinedButton.icon(
                          onPressed: _openEntryForm,
                          icon: const Icon(Icons.add_box_outlined, size: 18),
                          label: Text(t.operation.entryButton),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton.icon(
                          onPressed: _openAdjustmentForm,
                          icon: const Icon(Icons.tune_outlined, size: 18),
                          label: Text(t.operation.adjustmentButton),
                        ),
                        const SizedBox(width: 8),
                        FilledButton.icon(
                          onPressed: _openResourceForm,
                          icon: const Icon(Icons.add, size: 18),
                          label: Text(t.resource.defineButton),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // Info banner
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 4,
                ),
                child: Material(
                  color: Theme.of(
                    context,
                  ).colorScheme.secondaryContainer.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(8),
                  child: Padding(
                    padding: const EdgeInsets.all(10),
                    child: Row(
                      children: [
                        const Icon(Icons.info_outline, size: 16),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            t.resource.varianceInfo,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // Resource list
            if (state is StateStockResourcesLoading)
              const SliverFillRemaining(
                hasScrollBody: false,
                child: Center(child: CircularProgressIndicator()),
              )
            else if (state is StateStockResourcesError)
              SliverFillRemaining(
                hasScrollBody: false,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(state.message),
                      const SizedBox(height: 8),
                      FilledButton(
                        onPressed: () => context
                            .read<CubitStockResources>()
                            .load(shopId: widget.shopId),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                ),
              )
            else if (state is StateStockResourcesLoaded)
              if (state.resources.isEmpty)
                SliverFillRemaining(
                  hasScrollBody: false,
                  child: Center(child: Text(t.resource.emptyState)),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
                  sliver: SliverList.separated(
                    itemCount: state.resources.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final resource = state.resources[index];
                      final overviewMap = Map.fromEntries(
                        state.overview.map(
                          (o) => MapEntry(o.stockResourceId, o),
                        ),
                      );
                      final overview = overviewMap[resource.id];
                      final variance = overview?.variance?.toDouble() ?? 0;
                      final isNegative = variance < -0.0001;
                      final isPositive = variance > 0.0001;
                      final varianceColor = isNegative
                          ? Colors.red
                          : isPositive
                          ? Colors.green
                          : null;

                      return Card(
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(
                            color: isNegative
                                ? Colors.red.withValues(alpha: 0.3)
                                : Theme.of(context).colorScheme.outlineVariant,
                          ),
                        ),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(12),
                          onTap: () => _openResourceForm(resource: resource),
                          child: Padding(
                            padding: const EdgeInsets.all(12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        resource.name ?? '',
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleSmall
                                            ?.copyWith(
                                              fontWeight: FontWeight.bold,
                                            ),
                                      ),
                                    ),
                                    Text(
                                      resource.unitType?.value ?? '',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodySmall
                                          ?.copyWith(
                                            color: Theme.of(
                                              context,
                                            ).colorScheme.onSurfaceVariant,
                                          ),
                                    ),
                                    const SizedBox(width: 4),
                                    const Icon(Icons.edit_outlined, size: 16),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    _StatChip(
                                      label: t.resource.table.realStock,
                                      value: _fmtQty(
                                        overview?.realQuantity ??
                                            resource.quantity,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    _StatChip(
                                      label: t.resource.table.expectedStock,
                                      value: _fmtQty(
                                        overview?.expectedQuantity ??
                                            resource.quantity,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    _StatChip(
                                      label: t
                                          .resource
                                          .table
                                          .varianceFromLastCount,
                                      value:
                                          (variance >= 0 ? '+' : '') +
                                          _fmtQty(variance),
                                      color: varianceColor,
                                    ),
                                  ],
                                ),
                                if ((resource.reorderThreshold ?? 0) > 0)
                                  Padding(
                                    padding: const EdgeInsets.only(top: 4),
                                    child: Text(
                                      'Reorder at: '
                                      '${_fmtQty(resource.reorderThreshold)}',
                                      style: Theme.of(context)
                                          .textTheme
                                          .labelSmall
                                          ?.copyWith(
                                            color: Theme.of(
                                              context,
                                            ).colorScheme.onSurfaceVariant,
                                          ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                )
            else
              const SliverToBoxAdapter(child: SizedBox.shrink()),

            // Operation history section
            SliverToBoxAdapter(
              child: _OperationHistorySection(
                shopId: widget.shopId,
                onTap: _openOperationDetail,
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 80)),
          ],
        );
      },
    );
  }

  static String _fmtQty(num? value) {
    if (value == null) return '-';
    final d = value.toDouble();
    if (d == d.truncateToDouble()) return d.toStringAsFixed(0);
    return d.toStringAsFixed(2);
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({required this.label, required this.value, this.color});

  final String label;
  final String value;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.labelSmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            fontWeight: FontWeight.w600,
            color: color,
          ),
        ),
      ],
    );
  }
}

class _OperationHistorySection extends StatefulWidget {
  const _OperationHistorySection({required this.shopId, required this.onTap});

  final String shopId;
  final void Function(StockOperationDTO) onTap;

  @override
  State<_OperationHistorySection> createState() =>
      _OperationHistorySectionState();
}

class _OperationHistorySectionState extends State<_OperationHistorySection> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final t = context.t.stock;

    return BlocBuilder<CubitStockOperations, StateStockOperations>(
      builder: (context, state) {
        final history = switch (state) {
          StateStockOperationsHistoryLoaded(:final history) => history,
          StateStockOperationsSuccess(:final history) => history,
          StateStockOperationsError(:final history) => history,
          StateStockOperationsIdle(:final history) => history,
          _ => <StockOperationDTO>[],
        };

        if (history.isEmpty) return const SizedBox.shrink();

        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Divider(height: 1),
            InkWell(
              onTap: () => setState(() => _expanded = !_expanded),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        t.operation.historyTitle,
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Icon(_expanded ? Icons.expand_less : Icons.expand_more),
                  ],
                ),
              ),
            ),
            if (_expanded)
              SizedBox(
                height: 240,
                child: ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  itemCount: history.length,
                  itemBuilder: (context, index) {
                    final op = history[index];
                    final typeLabel = op.operationType?.value ?? '';
                    return ListTile(
                      dense: true,
                      contentPadding: EdgeInsets.zero,
                      title: Text('$typeLabel  •  ${op.referenceNo ?? ''}'),
                      subtitle: Text(
                        '${op.itemCount ?? 0} ${t.operation.itemCount}  •  '
                        '${op.status?.value ?? ''}',
                      ),
                      trailing: const Icon(Icons.chevron_right, size: 18),
                      onTap: () => widget.onTap(op),
                    );
                  },
                ),
              ),
          ],
        );
      },
    );
  }
}
