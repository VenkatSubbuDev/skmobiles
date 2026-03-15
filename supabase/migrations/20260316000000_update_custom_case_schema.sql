-- Update custom_case_orders table for detailed addressing and payments
ALTER TABLE public.custom_case_orders 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS pincode TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

-- Ensure mobile branding references are correct if they were renamed in complete_schema.sql
-- (Note: complete_schema.sql already handles the rename to brands/models at the end)

-- Add comment for clarity
COMMENT ON COLUMN public.custom_case_orders.payment_status IS 'Can be pending, paid, or failed';
