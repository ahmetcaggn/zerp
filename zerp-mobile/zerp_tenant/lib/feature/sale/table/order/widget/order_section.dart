import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:zerp_tenant/feature/sale/table/order/cubit/cubit_table_order.dart';
import 'package:zerp_tenant/feature/sale/table/order/widget/order_item_list.dart';
import 'package:zerp_tenant/product/ui/localization/gen/strings.g.dart';

final class OrderSection extends StatelessWidget {
  const OrderSection({
    required this.cartItems,
    required this.noteController,
    super.key,
  });

  final List<CartItem> cartItems;
  final TextEditingController noteController;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          OrderItemList(
            items: cartItems,
            onQuantityChanged: (item, delta) {
              context.read<CubitTableOrder>().updateCartItemQuantity(
                item,
                delta,
              );
            },
          ),
          const SizedBox(height: 16),
          TextField(
            controller: noteController,
            decoration: InputDecoration(
              labelText: context.t.sale.order.orderNotes,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            maxLines: 2,
            onChanged: (note) {
              context.read<CubitTableOrder>().updateOrderNote(note);
            },
          ),
        ],
      ),
    );
  }
}
