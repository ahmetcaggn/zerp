import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/cubit/root_cubit/organization_scope/cubit_organization_scope.dart';
import 'package:zerp_tenant/product/service/sale/sale_service.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

@injectable
class CubitTableOrder extends Cubit<StateTableOrder>
    with LoggerMixin<CubitTableOrder> {
  CubitTableOrder(this._saleService, this._cubitOrganizationScope)
    : super(const StateTableOrderInitial());

  final SaleService _saleService;
  final CubitOrganizationScope _cubitOrganizationScope;

  String get shopId {
    final currentState = _cubitOrganizationScope.state;
    if (currentState is! StateOrganizationScopeShop) {
      log.severe('Organization scope is not in shop scope, cannot get shop ID');
      throw StateError('Organization scope is not in shop scope');
    }

    final shopId = currentState.shop.id;
    if (shopId == null) {
      log.severe('Shop ID is null in organization scope');
      throw StateError('Shop ID is null in organization scope');
    }
    return shopId;
  }

  bool get hasUnsavedChanges {
    final currentState = state;
    if (currentState is! StateTableOrderLoaded) return false;
    return currentState.hasUnsavedChanges;
  }

  Future<void> init({required String tableId}) async {
    emit(const StateTableOrderLoading());
    try {
      final activeOrders = await _saleService.getActiveOrders(tableId: tableId);
      final categoriesRes = await _saleService.getMenuCategories(
        shopId: shopId,
      );
      final menuItemsRes = await _saleService.getMenuItems(shopId: shopId);

      final orders = <OrderEntry>[];

      if (activeOrders.isNotEmpty) {
        for (final existingOrder in activeOrders) {
          final cartItems = <CartItem>[];
          final note = existingOrder.note;
          for (final item in existingOrder.items) {
            cartItems.add(
              CartItem(
                menuItemId: item.menuItemId ?? '',
                name: item.menuItemName ?? '',
                quantity: item.quantity ?? 1,
                unitPrice: item.unitPrice ?? 0,
                notes: item.notes,
                selectedExtraOptionIds: item.selectedExtraOptions
                    .map((opt) => opt.extraOptionId ?? '')
                    .toList(),
              ),
            );
          }
          orders.add(
            OrderEntry(
              cartItems: cartItems,
              note: note,
              existingOrder: existingOrder,
            ),
          );
        }
      } else {
        orders.add(const OrderEntry(cartItems: []));
      }

      emit(
        StateTableOrderLoaded(
          categories: categoriesRes.items,
          menuItems: menuItemsRes.items,
          orders: orders,
          selectedOrderIndex: 0,
        ),
      );
    } on Object catch (e) {
      emit(
        StateTableOrderError(
          message: t.sale.errors.failedToInitOrder(error: e.toString()),
        ),
      );
    }
  }

  void selectCategory(String? categoryId) {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      if (categoryId == null) {
        emit(currentState.copyWith(clearSelectedCategoryId: true));
      } else {
        emit(currentState.copyWith(selectedCategoryId: categoryId));
      }
    }
  }

  void selectOrder(int index) {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      if (index >= 0 && index < currentState.orders.length) {
        emit(currentState.copyWith(selectedOrderIndex: index));
      }
    }
  }

  void addNewOrder() {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      final updatedOrders = List<OrderEntry>.from(currentState.orders)
        ..add(const OrderEntry(cartItems: []));
      emit(
        currentState.copyWith(
          orders: updatedOrders,
          selectedOrderIndex: updatedOrders.length - 1,
        ),
      );
    }
  }

  void removeNewEmptyOrder(int index) {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      if (index >= 0 && index < currentState.orders.length) {
        final order = currentState.orders[index];
        if (order.existingOrder == null &&
            order.cartItems.isEmpty &&
            (order.note == null || order.note!.isEmpty)) {
          final updatedOrders = List<OrderEntry>.from(currentState.orders)
            ..removeAt(index);
          var newIndex = currentState.selectedOrderIndex;
          if (newIndex >= index && newIndex > 0) {
            newIndex--;
          }
          if (updatedOrders.isEmpty) {
            updatedOrders.add(const OrderEntry(cartItems: []));
            newIndex = 0;
          }
          emit(
            currentState.copyWith(
              orders: updatedOrders,
              selectedOrderIndex: newIndex,
            ),
          );
        }
      }
    }
  }

  void addMenuItemToOrder(MenuItemDTO menuItem) {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      final currentOrder = currentState.currentOrder;
      final updatedCart = List<CartItem>.from(currentOrder.cartItems);
      final index = updatedCart.indexWhere(
        (item) => item.menuItemId == menuItem.id,
      );

      if (index != -1) {
        final existingItem = updatedCart[index];
        updatedCart[index] = existingItem.copyWith(
          quantity: existingItem.quantity + 1,
        );
      } else {
        updatedCart.add(
          CartItem(
            menuItemId: menuItem.id ?? '',
            name: menuItem.name ?? '',
            quantity: 1,
            unitPrice: menuItem.price ?? 0,
          ),
        );
      }

      final updatedOrders = List<OrderEntry>.from(currentState.orders);
      updatedOrders[currentState.selectedOrderIndex] = currentOrder.copyWith(
        cartItems: updatedCart,
      );

      emit(currentState.copyWith(orders: updatedOrders));
    }
  }

  void updateCartItemQuantity(String menuItemId, int delta) {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      final currentOrder = currentState.currentOrder;
      final updatedCart = List<CartItem>.from(currentOrder.cartItems);
      final index = updatedCart.indexWhere(
        (item) => item.menuItemId == menuItemId,
      );

      if (index != -1) {
        final existingItem = updatedCart[index];
        final newQuantity = existingItem.quantity + delta;
        if (newQuantity <= 0) {
          updatedCart.removeAt(index);
        } else {
          updatedCart[index] = existingItem.copyWith(quantity: newQuantity);
        }
        final updatedOrders = List<OrderEntry>.from(currentState.orders);
        updatedOrders[currentState.selectedOrderIndex] = currentOrder.copyWith(
          cartItems: updatedCart,
        );
        emit(currentState.copyWith(orders: updatedOrders));
      }
    }
  }

  void updateOrderNote(String note) {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      final updatedOrders = List<OrderEntry>.from(currentState.orders);
      updatedOrders[currentState.selectedOrderIndex] = currentState.currentOrder
          .copyWith(note: note);
      emit(currentState.copyWith(orders: updatedOrders));
    }
  }

  Future<bool> importFromCodeAsNewOrder({
    required String code,
    required String tableId,
  }) async {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      emit(currentState.copyWith(isImporting: true));
      try {
        final preview = await _saleService.previewPublicCartOrder(
          code: code,
          tableId: tableId,
        );
        final cartItems = <CartItem>[];

        for (final item in preview.items) {
          cartItems.add(
            CartItem(
              menuItemId: item.menuItemId ?? '',
              name: item.menuItemName ?? '',
              quantity: item.quantity ?? 1,
              unitPrice: item.unitPrice ?? 0,
              notes: item.notes,
            ),
          );
        }

        final updatedOrders = List<OrderEntry>.from(currentState.orders);

        // If the current order is completely empty (no items, no note,
        // no existing order), we can just replace it.
        // Otherwise, add a new order tab.
        var newIndex = updatedOrders.length;
        if (updatedOrders.length == 1 &&
            updatedOrders[0].cartItems.isEmpty &&
            (updatedOrders[0].note == null || updatedOrders[0].note!.isEmpty) &&
            updatedOrders[0].existingOrder == null) {
          updatedOrders[0] = OrderEntry(
            cartItems: cartItems,
            note: preview.note,
          );
          newIndex = 0;
        } else {
          updatedOrders.add(
            OrderEntry(cartItems: cartItems, note: preview.note),
          );
        }

        emit(
          currentState.copyWith(
            orders: updatedOrders,
            selectedOrderIndex: newIndex,
            isImporting: false,
          ),
        );
        return true;
      } on Object catch (e) {
        log.severe('Failed to import public cart order: $e');
        emit(currentState.copyWith(isImporting: false));
        return false;
      }
    }
    return false;
  }

  Future<bool> importFromCodeToCurrentOrder({
    required String code,
    required String tableId,
  }) async {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      emit(currentState.copyWith(isImporting: true));
      try {
        final preview = await _saleService.previewPublicCartOrder(
          code: code,
          tableId: tableId,
        );

        final currentOrder = currentState.currentOrder;
        final updatedCart = List<CartItem>.from(currentOrder.cartItems);

        for (final item in preview.items) {
          final index = updatedCart.indexWhere(
            (it) => it.menuItemId == item.menuItemId,
          );
          if (index != -1) {
            final existingItem = updatedCart[index];
            updatedCart[index] = existingItem.copyWith(
              quantity: existingItem.quantity + (item.quantity ?? 1),
            );
          } else {
            updatedCart.add(
              CartItem(
                menuItemId: item.menuItemId ?? '',
                name: item.menuItemName ?? '',
                quantity: item.quantity ?? 1,
                unitPrice: item.unitPrice ?? 0,
                notes: item.notes,
              ),
            );
          }
        }

        var newNote = currentOrder.note;
        if (preview.note != null && preview.note!.isNotEmpty) {
          if (newNote == null || newNote.isEmpty) {
            newNote = preview.note;
          } else {
            newNote = '$newNote | ${preview.note}';
          }
        }

        final updatedOrders = List<OrderEntry>.from(currentState.orders);
        updatedOrders[currentState.selectedOrderIndex] = currentOrder.copyWith(
          cartItems: updatedCart,
          note: newNote,
        );

        emit(
          currentState.copyWith(
            orders: updatedOrders,
            isImporting: false,
          ),
        );
        return true;
      } on Object catch (e) {
        log.severe('Failed to import public cart order to current order: $e');
        emit(currentState.copyWith(isImporting: false));
        return false;
      }
    }
    return false;
  }

  Future<bool> saveOrder({required String tableId}) async {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      emit(currentState.copyWith(isSaving: true));
      try {
        final currentOrder = currentState.currentOrder;
        final items = currentOrder.cartItems.map((item) {
          return TableOrderItemCreateDTO(
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            notes: item.notes,
            selectedExtraOptionIds: item.selectedExtraOptionIds,
          );
        }).toList();

        if (currentOrder.existingOrder != null) {
          final updateDTO = TableOrderUpdateDTO(
            status: TableOrderUpdateDTOStatusEnum.OPEN,
            note: currentOrder.note,
            items: items,
          );
          await _saleService.updateTableOrder(
            orderId: currentOrder.existingOrder!.id ?? '',
            updateDTO: updateDTO,
          );
        } else {
          final createDTO = TableOrderCreateDTO(
            tableId: tableId,
            note: currentOrder.note,
            items: items,
          );
          await _saleService.createTableOrder(createDTO: createDTO);
        }

        // Re-initialize to fetch updated order info from API
        await init(tableId: tableId);
        return true;
      } on Object catch (e) {
        log.severe('Failed to save order: $e');
        emit(currentState.copyWith(isSaving: false));
        return false;
      }
    }
    return false;
  }

  Future<bool> cancelOrder({required String tableId}) async {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      final currentOrder = currentState.currentOrder;
      if (currentOrder.existingOrder != null) {
        emit(currentState.copyWith(isSaving: true));
        try {
          await _saleService.cancelTableOrder(
            orderId: currentOrder.existingOrder!.id ?? '',
          );
          await init(tableId: tableId);
          return true;
        } on Object catch (e) {
          log.severe('Failed to cancel order: $e');
          emit(currentState.copyWith(isSaving: false));
          return false;
        }
      } else {
        // If it's a new unsaved order, just remove it locally
        final updatedOrders = List<OrderEntry>.from(currentState.orders)
          ..removeAt(currentState.selectedOrderIndex);
        var newIndex = currentState.selectedOrderIndex;
        if (newIndex >= updatedOrders.length && newIndex > 0) {
          newIndex--;
        }
        if (updatedOrders.isEmpty) {
          updatedOrders.add(const OrderEntry(cartItems: []));
          newIndex = 0;
        }
        emit(
          currentState.copyWith(
            orders: updatedOrders,
            selectedOrderIndex: newIndex,
          ),
        );
        return true;
      }
    }
    return false;
  }
}

class OrderEntry {
  const OrderEntry({
    required this.cartItems,
    this.existingOrder,
    this.note,
  });

  final List<CartItem> cartItems;
  final TableOrderDTO? existingOrder;
  final String? note;

  OrderEntry copyWith({
    List<CartItem>? cartItems,
    TableOrderDTO? existingOrder,
    bool clearExistingOrder = false,
    String? note,
    bool clearNote = false,
  }) {
    return OrderEntry(
      cartItems: cartItems ?? this.cartItems,
      existingOrder: clearExistingOrder
          ? null
          : (existingOrder ?? this.existingOrder),
      note: clearNote ? null : (note ?? this.note),
    );
  }
}

class CartItem {
  CartItem({
    required this.menuItemId,
    required this.name,
    required this.quantity,
    required this.unitPrice,
    this.notes,
    this.selectedExtraOptionIds = const [],
  });

  final String menuItemId;
  final String name;
  final num unitPrice;
  final int quantity;
  final String? notes;
  final List<String> selectedExtraOptionIds;

  num get totalPrice => unitPrice * quantity;

  CartItem copyWith({
    String? menuItemId,
    String? name,
    num? unitPrice,
    int? quantity,
    String? notes,
    List<String>? selectedExtraOptionIds,
  }) {
    return CartItem(
      menuItemId: menuItemId ?? this.menuItemId,
      name: name ?? this.name,
      unitPrice: unitPrice ?? this.unitPrice,
      quantity: quantity ?? this.quantity,
      notes: notes ?? this.notes,
      selectedExtraOptionIds:
          selectedExtraOptionIds ?? this.selectedExtraOptionIds,
    );
  }
}

sealed class StateTableOrder {
  const StateTableOrder();
}

final class StateTableOrderInitial extends StateTableOrder {
  const StateTableOrderInitial();
}

final class StateTableOrderLoading extends StateTableOrder {
  const StateTableOrderLoading();
}

final class StateTableOrderLoaded extends StateTableOrder {
  StateTableOrderLoaded({
    required this.categories,
    required this.menuItems,
    required this.orders,
    required int selectedOrderIndex,
    this.isSaving = false,
    this.isImporting = false,
    this.selectedCategoryId,
  }) : selectedOrderIndex = orders.isEmpty
           ? 0
           : selectedOrderIndex.clamp(0, orders.length - 1);

  final List<MenuCategoryDTO> categories;
  final List<MenuItemDTO> menuItems;
  final List<OrderEntry> orders;
  final int selectedOrderIndex;
  final bool isSaving;
  final bool isImporting;
  final String? selectedCategoryId;

  OrderEntry get currentOrder {
    if (orders.isEmpty) {
      return const OrderEntry(cartItems: []);
    }
    final safeIndex = selectedOrderIndex.clamp(0, orders.length - 1);
    return orders[safeIndex];
  }

  bool get hasUnsavedChanges {
    // If there is exactly one order and it is completely empty and new,
    // it is not an unsaved change.
    // This allows popping from a newly opened empty table without a discard
    // dialog.
    if (orders.length == 1) {
      final order = orders[0];
      if (order.existingOrder == null &&
          order.cartItems.isEmpty &&
          (order.note == null || order.note!.isEmpty)) {
        return false;
      }
    }

    for (final orderEntry in orders) {
      if (_hasOrderChanged(orderEntry)) return true;
    }
    return false;
  }

  bool _hasOrderChanged(OrderEntry orderEntry) {
    final existingOrder = orderEntry.existingOrder;
    final cartItems = orderEntry.cartItems;
    final currentNote = orderEntry.note ?? '';

    if (existingOrder == null) {
      // If it's a new order (and not caught by the single-empty-order
      // check above), it is considered an unsaved change.
      return true;
    }

    // Compare notes
    final originalNote = existingOrder.note ?? '';
    if (currentNote != originalNote) return true;

    // Compare items length
    final originalItems = existingOrder.items;
    if (cartItems.length != originalItems.length) return true;

    // Compare each item
    for (final cartItem in cartItems) {
      final originalItemIndex = originalItems.indexWhere(
        (it) => it.menuItemId == cartItem.menuItemId,
      );
      if (originalItemIndex == -1) return true;

      final originalItem = originalItems[originalItemIndex];
      if (cartItem.quantity != originalItem.quantity) return true;
      if ((cartItem.notes ?? '') != (originalItem.notes ?? '')) return true;

      // Compare selected extra option IDs
      final originalExtraIds =
          originalItem.selectedExtraOptions
              .map((opt) => opt.extraOptionId ?? '')
              .toList()
            ..sort();
      final currentExtraIds = List<String>.from(cartItem.selectedExtraOptionIds)
        ..sort();

      if (originalExtraIds.length != currentExtraIds.length) return true;
      for (var i = 0; i < originalExtraIds.length; i++) {
        if (originalExtraIds[i] != currentExtraIds[i]) return true;
      }
    }

    return false;
  }

  StateTableOrderLoaded copyWith({
    List<MenuCategoryDTO>? categories,
    List<MenuItemDTO>? menuItems,
    List<OrderEntry>? orders,
    int? selectedOrderIndex,
    bool? isSaving,
    bool? isImporting,
    String? selectedCategoryId,
    bool clearSelectedCategoryId = false,
  }) {
    return StateTableOrderLoaded(
      categories: categories ?? this.categories,
      menuItems: menuItems ?? this.menuItems,
      orders: orders ?? this.orders,
      selectedOrderIndex: selectedOrderIndex ?? this.selectedOrderIndex,
      isSaving: isSaving ?? this.isSaving,
      isImporting: isImporting ?? this.isImporting,
      selectedCategoryId: clearSelectedCategoryId
          ? null
          : (selectedCategoryId ?? this.selectedCategoryId),
    );
  }
}

final class StateTableOrderError extends StateTableOrder {
  const StateTableOrderError({required this.message});

  final String message;
}
