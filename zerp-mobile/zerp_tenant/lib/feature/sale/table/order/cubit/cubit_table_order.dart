import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:openapi_sale/api.dart';
import 'package:remote_logging/remote_logging.dart';
import 'package:zerp_tenant/product/service/sale/sale_service.dart';

@injectable
class CubitTableOrder extends Cubit<StateTableOrder>
    with LoggerMixin<CubitTableOrder> {
  CubitTableOrder(this._saleService) : super(const StateTableOrderInitial());

  final SaleService _saleService;

  bool get hasUnsavedChanges {
    final currentState = state;
    if (currentState is! StateTableOrderLoaded) return false;

    final existingOrder = currentState.existingOrder;
    final cartItems = currentState.cartItems;
    final currentNote = currentState.note ?? '';

    if (existingOrder == null) {
      return cartItems.isNotEmpty || currentNote.isNotEmpty;
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
      final originalExtraIds = originalItem.selectedExtraOptions
          .map((opt) => opt.extraOptionId ?? '')
          .toList()
        ..sort();
      final currentExtraIds = List<String>.from(cartItem.selectedExtraOptionIds)
        ..sort();

      if (originalExtraIds.length != currentExtraIds.length) return true;
      for (int i = 0; i < originalExtraIds.length; i++) {
        if (originalExtraIds[i] != currentExtraIds[i]) return true;
      }
    }

    return false;
  }

  Future<void> init({
    required String shopId,
    required String tableId,
  }) async {
    emit(const StateTableOrderLoading());
    try {
      final activeOrders = await _saleService.getActiveOrders(tableId: tableId);
      final categoriesRes = await _saleService.getMenuCategories(
        shopId: shopId,
      );
      final menuItemsRes = await _saleService.getMenuItems(shopId: shopId);

      final existingOrder = activeOrders.isNotEmpty ? activeOrders.first : null;
      final cartItems = <CartItem>[];
      String? note;

      if (existingOrder != null) {
        note = existingOrder.note;
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
      }

      emit(
        StateTableOrderLoaded(
          categories: categoriesRes.items,
          menuItems: menuItemsRes.items,
          cartItems: cartItems,
          existingOrder: existingOrder,
          note: note,
        ),
      );
    } on Object catch (e) {
      emit(
        StateTableOrderError(message: 'Failed to initialize order details: $e'),
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

  void addMenuItemToOrder(MenuItemDTO menuItem) {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      final updatedCart = List<CartItem>.from(currentState.cartItems);
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

      emit(currentState.copyWith(cartItems: updatedCart));
    }
  }

  void updateCartItemQuantity(String menuItemId, int delta) {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      final updatedCart = List<CartItem>.from(currentState.cartItems);
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
        emit(currentState.copyWith(cartItems: updatedCart));
      }
    }
  }

  void updateOrderNote(String note) {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      emit(currentState.copyWith(note: note));
    }
  }

  Future<bool> importFromCode({
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
        final updatedCart = List<CartItem>.from(currentState.cartItems);

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

        var newNote = currentState.note;
        if (preview.note != null && preview.note!.isNotEmpty) {
          if (newNote == null || newNote.isEmpty) {
            newNote = preview.note;
          } else {
            newNote = '$newNote | ${preview.note}';
          }
        }

        emit(
          currentState.copyWith(
            cartItems: updatedCart,
            note: newNote,
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

  Future<bool> saveOrder({
    required String shopId,
    required String tableId,
  }) async {
    final currentState = state;
    if (currentState is StateTableOrderLoaded) {
      emit(currentState.copyWith(isSaving: true));
      try {
        final items = currentState.cartItems.map((item) {
          return TableOrderItemCreateDTO(
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            notes: item.notes,
            selectedExtraOptionIds: item.selectedExtraOptionIds,
          );
        }).toList();

        if (currentState.existingOrder != null) {
          final updateDTO = TableOrderUpdateDTO(
            status: TableOrderUpdateDTOStatusEnum.OPEN,
            note: currentState.note,
            items: items,
          );
          await _saleService.updateTableOrder(
            orderId: currentState.existingOrder!.id ?? '',
            updateDTO: updateDTO,
          );
        } else {
          final createDTO = TableOrderCreateDTO(
            tableId: tableId,
            note: currentState.note,
            items: items,
          );
          await _saleService.createTableOrder(createDTO: createDTO);
        }

        // Re-initialize to fetch updated order info from API
        await init(shopId: shopId, tableId: tableId);
        return true;
      } on Object catch (e) {
        log.severe('Failed to save order: $e');
        emit(currentState.copyWith(isSaving: false));
        return false;
      }
    }
    return false;
  }

  Future<bool> cancelOrder({
    required String shopId,
    required String tableId,
  }) async {
    final currentState = state;
    if (currentState is StateTableOrderLoaded &&
        currentState.existingOrder != null) {
      emit(currentState.copyWith(isSaving: true));
      try {
        await _saleService.cancelTableOrder(
          orderId: currentState.existingOrder!.id ?? '',
        );
        await init(shopId: shopId, tableId: tableId);
        return true;
      } on Object catch (e) {
        log.severe('Failed to cancel order: $e');
        emit(currentState.copyWith(isSaving: false));
        return false;
      }
    }
    return false;
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
  const StateTableOrderLoaded({
    required this.categories,
    required this.menuItems,
    required this.cartItems,
    this.existingOrder,
    this.note,
    this.isSaving = false,
    this.isImporting = false,
    this.selectedCategoryId,
  });

  final List<MenuCategoryDTO> categories;
  final List<MenuItemDTO> menuItems;
  final List<CartItem> cartItems;
  final TableOrderDTO? existingOrder;
  final String? note;
  final bool isSaving;
  final bool isImporting;
  final String? selectedCategoryId;

  StateTableOrderLoaded copyWith({
    List<MenuCategoryDTO>? categories,
    List<MenuItemDTO>? menuItems,
    List<CartItem>? cartItems,
    TableOrderDTO? existingOrder,
    bool clearExistingOrder = false,
    String? note,
    bool clearNote = false,
    bool? isSaving,
    bool? isImporting,
    String? selectedCategoryId,
    bool clearSelectedCategoryId = false,
  }) {
    return StateTableOrderLoaded(
      categories: categories ?? this.categories,
      menuItems: menuItems ?? this.menuItems,
      cartItems: cartItems ?? this.cartItems,
      existingOrder: clearExistingOrder
          ? null
          : (existingOrder ?? this.existingOrder),
      note: clearNote ? null : (note ?? this.note),
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
