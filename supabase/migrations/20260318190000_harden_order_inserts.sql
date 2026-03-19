-- Harden checkout: prevent direct client-side order/order_item inserts.
-- Orders and order_items should be created only via secure server logic.

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;

