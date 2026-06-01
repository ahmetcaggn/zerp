import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:openapi_resource/api.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_movements.dart';
import 'package:zerp_tenant/feature/stock/cubit/cubit_stock_resources.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

class StockMovementTab extends StatefulWidget {
  const StockMovementTab({
    required this.shopId,
    super.key,
  });

  final String shopId;

  @override
  State<StockMovementTab> createState() => _StockMovementTabState();
}

class _StockMovementTabState extends State<StockMovementTab> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await context.read<CubitStockMovements>().load(shopId: widget.shopId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t.stock;
    final resourceState = context.watch<CubitStockResources>().state;
    final resources = resourceState is StateStockResourcesLoaded
        ? resourceState.resources
        : <StockResourceDTO>[];

    return BlocBuilder<CubitStockMovements, StateStockMovements>(
      builder: (context, state) {
        final cubit = context.read<CubitStockMovements>();

        final loaded = state is StateStockMovementsLoaded ? state : null;
        final loadingParams = state is StateStockMovementsLoading
            ? state
            : null;
        final period =
            loaded?.period ?? loadingParams?.period ?? StockMovementPeriod.week;
        final cursor =
            loaded?.cursor ?? loadingParams?.cursor ?? DateTime.now();
        final selectedResourceId =
            loaded?.selectedResourceId ?? loadingParams?.selectedResourceId;
        final selectedBucket = loaded?.selectedBucketStart;

        final movements = loaded?.movements ?? [];
        final filteredMovements = selectedBucket == null
            ? movements
            : movements.where((m) {
                if (m.createdAt == null) return false;
                final dt = m.createdAt!;
                final bucketDt = DateTime.tryParse(selectedBucket);
                if (bucketDt == null) return true;

                final duration = period == StockMovementPeriod.month
                    ? const Duration(days: 7)
                    : const Duration(days: 1);
                final endDt = bucketDt.add(duration);

                return dt.compareTo(bucketDt) >= 0 && dt.compareTo(endDt) < 0;
              }).toList();

        return CustomScrollView(
          slivers: [
            // ── Period selector & Date navigator ──
            MediaQuery.removePadding(
              context: context,
              removeTop: true,
              child: SliverAppBar(
                floating: true,
                automaticallyImplyLeading: false,
                toolbarHeight: 104,
                backgroundColor: Theme.of(context).scaffoldBackgroundColor,
                surfaceTintColor: Theme.of(context).scaffoldBackgroundColor,
                shadowColor: Theme.of(
                  context,
                ).colorScheme.onSurface.withValues(alpha: 0.2),
                titleSpacing: 0,
                title: Column(
                  children: [
                    const SizedBox(height: 8),

                    // ── Period selector ──
                    SizedBox(
                      height: 48,
                      child: SegmentedButton<StockMovementPeriod>(
                        segments: [
                          ButtonSegment(
                            value: StockMovementPeriod.day,
                            label: Text(t.movement.filters.periods.DAY),
                          ),
                          ButtonSegment(
                            value: StockMovementPeriod.week,
                            label: Text(t.movement.filters.periods.WEEK),
                          ),
                          ButtonSegment(
                            value: StockMovementPeriod.month,
                            label: Text(t.movement.filters.periods.MONTH),
                          ),
                        ],
                        selected: {period},
                        onSelectionChanged: (v) => cubit.changePeriod(v.first),
                      ),
                    ),

                    // ── Date navigator ──
                    SizedBox(
                      height: 48,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 4,
                        ),
                        child: Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.chevron_left),
                              tooltip: t.movement.filters.previous,
                              onPressed: () => cubit.shiftCursor(-1),
                            ),
                            Expanded(
                              child: InkWell(
                                onTap: () async {
                                  final picked = await showDatePicker(
                                    context: context,
                                    initialDate: cursor,
                                    firstDate: DateTime(2020),
                                    lastDate: DateTime.now(),
                                  );
                                  if (picked != null && context.mounted) {
                                    await cubit.load(
                                      shopId: widget.shopId,
                                      cursor: picked,
                                    );
                                  }
                                },
                                child: Center(
                                  child: Text(
                                    _cursorLabel(period, cursor),
                                    style: Theme.of(
                                      context,
                                    ).textTheme.titleSmall,
                                  ),
                                ),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.chevron_right),
                              tooltip: t.movement.filters.next,
                              onPressed: cursor.isBefore(DateTime.now())
                                  ? () => cubit.shiftCursor(1)
                                  : null,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            if (state is StateStockMovementsLoading ||
                state is StateStockMovementsInitial)
              const SliverFillRemaining(
                hasScrollBody: false,
                child: Center(child: CircularProgressIndicator()),
              )
            else if (state is StateStockMovementsError)
              SliverFillRemaining(
                hasScrollBody: false,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(state.message),
                      const SizedBox(height: 8),
                      FilledButton(
                        onPressed: () => cubit.load(shopId: widget.shopId),
                        child: Text(context.t.common.retry),
                      ),
                    ],
                  ),
                ),
              )
            else ...[
              SliverToBoxAdapter(
                child: Column(
                  children: [
                    // ── Resource filter ──
                    if (resources.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
                        child: DropdownButtonFormField<String?>(
                          initialValue: selectedResourceId,
                          decoration: InputDecoration(
                            labelText: t.movement.filters.stockType,
                            isDense: true,
                            border: const OutlineInputBorder(),
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                          ),
                          items: [
                            DropdownMenuItem<String?>(
                              child: Text(t.movement.filters.allStockTypes),
                            ),
                            ...resources.map(
                              (r) => DropdownMenuItem<String?>(
                                value: r.id,
                                child: Text(r.name ?? r.id ?? ''),
                              ),
                            ),
                          ],
                          onChanged: cubit.changeResource,
                        ),
                      ),

                    // ── Chart ──
                    if (loaded != null && period != StockMovementPeriod.day)
                      _StockFlowChart(
                        timeline: loaded.timeline,
                        selectedBucket: selectedBucket,
                        onBucketTap: cubit.selectBucket,
                      ),

                    // ── Drill-down list ──
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              '${t.tabs.movements} (${filteredMovements.length})',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                          ),
                          Visibility(
                            visible: selectedBucket != null,
                            maintainSize: true,
                            maintainAnimation: true,
                            maintainState: true,
                            child: TextButton(
                              onPressed: () => cubit.selectBucket(null),
                              child: Text(t.movement.drillDown.clear),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              if (filteredMovements.isEmpty)
                SliverFillRemaining(
                  hasScrollBody: false,
                  child: Center(child: Text(t.movement.emptyState)),
                )
              else
                SliverPadding(
                  padding: EdgeInsets.fromLTRB(
                    16,
                    4,
                    16,
                    16 + MediaQuery.of(context).padding.bottom,
                  ),
                  sliver: SliverList.separated(
                    itemCount: filteredMovements.length,
                    separatorBuilder: (_, _) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final m = filteredMovements[index];
                      final qty = m.quantity?.toDouble() ?? 0;
                      final isIn = m.direction?.value == 'IN';
                      final sign = isIn ? '+' : '-';
                      final qtyColor = isIn ? Colors.green : Colors.red;
                      final subtitle = [
                        m.stockResourceName,
                        if (m.createdAt != null)
                          DateFormat.yMd().add_Hm().format(
                            m.createdAt!.toLocal(),
                          ),
                      ].where((v) => v != null && v.isNotEmpty).join(' · ');

                      return ListTile(
                        dense: true,
                        title: Text(
                          (context.t['stock.movement.types.${m.type?.value}']
                                  as String?) ??
                              m.type?.value ??
                              '',
                        ),
                        subtitle: Text(subtitle),
                        trailing: Text(
                          '$sign${qty.toStringAsFixed(2)}',
                          style: TextStyle(
                            color: qtyColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      );
                    },
                  ),
                ),
            ],
          ],
        );
      },
    );
  }

  static String _cursorLabel(StockMovementPeriod period, DateTime cursor) {
    switch (period) {
      case StockMovementPeriod.day:
        return DateFormat.yMMMd().format(cursor);
      case StockMovementPeriod.week:
        final monday = cursor.subtract(Duration(days: cursor.weekday - 1));
        final sunday = monday.add(const Duration(days: 6));
        return '${DateFormat.MMMd().format(monday)} – '
            '${DateFormat.MMMd().format(sunday)}';
      case StockMovementPeriod.month:
        return DateFormat.yMMM().format(cursor);
    }
  }
}

// ---------------------------------------------------------------------------
// Chart
// ---------------------------------------------------------------------------

class _StockFlowChart extends StatelessWidget {
  const _StockFlowChart({
    required this.timeline,
    required this.selectedBucket,
    required this.onBucketTap,
  });

  final StockMovementTimelineDTO timeline;
  final String? selectedBucket;
  final void Function(String?) onBucketTap;

  @override
  Widget build(BuildContext context) {
    final buckets = timeline.buckets;
    if (buckets.isEmpty) {
      return Padding(
        padding: const EdgeInsets.all(24),
        child: Center(
          child: Text(
            context.t.stock.movement.chart.emptyState,
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ),
      );
    }

    return SizedBox(
      height: 96,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final maxDelta = buckets.fold<double>(
              0,
              (m, b) => math.max(m, (b.movementDelta ?? 0).toDouble().abs()),
            );
            if (maxDelta == 0) {
              return Center(
                child: Text(context.t.stock.movement.chart.emptyState),
              );
            }

            final barWidth = (constraints.maxWidth / buckets.length).clamp(
              8.0,
              40.0,
            );
            final colorScheme = Theme.of(context).colorScheme;

            final hasSelection = selectedBucket != null;

            return Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: buckets.map((bucket) {
                final delta = (bucket.movementDelta ?? 0).toDouble();
                final heightFraction = delta.abs() / maxDelta;
                final isSelected =
                    bucket.bucketStart?.toIso8601String() == selectedBucket;

                return GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onBucketTap(
                    isSelected ? null : bucket.bucketStart?.toIso8601String(),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 1),
                    child: SizedBox(
                      width: barWidth - 2,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Container(
                            height:
                                ((constraints.maxHeight - 24) * heightFraction)
                                    .clamp(4.0, double.infinity),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? colorScheme.secondary
                                  : delta >= 0
                                  ? colorScheme.primary.withValues(
                                      alpha: hasSelection ? 0.3 : 0.7,
                                    )
                                  : colorScheme.error.withValues(
                                      alpha: hasSelection ? 0.3 : 0.7,
                                    ),
                              borderRadius: const BorderRadius.vertical(
                                top: Radius.circular(3),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ),
    );
  }
}
