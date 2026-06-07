import 'dart:async';

import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:zerp_tenant/product/navigation/app_route.gr.dart';
import 'package:zerp_tenant/product/service/user/permission_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@RoutePage()
class ScreenAccessDenied extends StatelessWidget {
  const ScreenAccessDenied({
    required this.requiredActions,
    super.key,
  });

  /// The set of actions the user needs at least one of to access the page
  /// they tried to visit.
  final Set<PermittableAction> requiredActions;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        leading: BackButton(
          onPressed: () {
            if (context.router.canPop()) {
              context.router.pop();
            } else {
              unawaited(context.router.replace(const RouteDashboard()));
            }
          },
        ),
        title: Text(context.t.permission.accessDenied.title),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 24),

              // ── Icon ────────────────────────────────────────────────────
              Container(
                width: 88,
                height: 88,
                decoration: BoxDecoration(
                  color: colorScheme.errorContainer,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.lock_outline_rounded,
                  size: 44,
                  color: colorScheme.onErrorContainer,
                ),
              ),
              const SizedBox(height: 24),

              // ── Headline ─────────────────────────────────────────────────
              Text(
                context.t.permission.accessDenied.title,
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                context.t.permission.accessDenied.description,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),

              // ── Required permissions list ─────────────────────────────────
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  context.t.permission.accessDenied.requiredPermissions,
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              ...requiredActions.map(
                (action) => _PermissionChip(action: action),
              ),

              const Spacer(),

              // ── Go to Dashboard ───────────────────────────────────────────
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: () =>
                      unawaited(context.router.replace(const RouteDashboard())),
                  icon: const Icon(Icons.home_outlined),
                  label: Text(context.t.permission.accessDenied.goToDashboard),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PermissionChip extends StatelessWidget {
  const _PermissionChip({required this.action});

  final PermittableAction action;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(
            Icons.key_rounded,
            size: 18,
            color: colorScheme.primary,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              action.name,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontFamily: 'monospace',
                color: colorScheme.onSurface,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
