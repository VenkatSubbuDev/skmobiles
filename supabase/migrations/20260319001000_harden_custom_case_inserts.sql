-- Harden custom case order inserts: disable public inserts from client.
-- Orders should be created via secure server function only.

DROP POLICY IF EXISTS "Anyone can create case orders" ON public.custom_case_orders;
DROP POLICY IF EXISTS "Guests can create case orders" ON public.custom_case_orders;

CREATE POLICY "Users can create own case orders"
ON public.custom_case_orders
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

