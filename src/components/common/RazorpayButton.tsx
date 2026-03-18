import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  /** Amount in INR (₹). Will be converted to paise internally. */
  amount: number;
  description?: string;
  /** Pre-fill customer details */
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  /** Called when payment is successfully verified */
  onSuccess?: (paymentId: string, orderId: string) => void;
  /** Called on payment failure */
  onFailure?: (error: any) => void;
  /** Optional DB order ID to link in verify step */
  dbOrderId?: string;
  /** Optional DB table name (default: 'orders') */
  dbTable?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

/** Loads the Razorpay checkout.js script once */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * RazorpayButton – a plug-and-play payment button.
 *
 * Usage:
 * ```tsx
 * <RazorpayButton
 *   amount={499}
 *   description="Screen Replacement – iPhone 13"
 *   prefill={{ name: 'Ravi Kumar', email: 'ravi@email.com', contact: '9876543210' }}
 *   onSuccess={(paymentId) => console.log('Paid!', paymentId)}
 * />
 * ```
 */
export default function RazorpayButton({
  amount,
  description = 'Payment to SK Mobiles',
  prefill,
  onSuccess,
  onFailure,
  dbOrderId,
  dbTable = 'orders',
  label = 'Pay Now',
  className = '',
  disabled = false,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePay = async () => {
    if (!amount || amount <= 0) {
      toast({ title: 'Invalid amount', description: 'Please enter a valid amount.', variant: 'destructive' });
      return;
    }

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKeyId || razorpayKeyId.includes('XXXX')) {
      toast({
        title: 'Payment not configured',
        description: 'Please set VITE_RAZORPAY_KEY_ID in your .env file.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    // 1. Load Razorpay SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast({ title: 'Network error', description: 'Failed to load payment gateway. Check your connection.', variant: 'destructive' });
      setLoading(false);
      return;
    }

    // 2. Create order via Edge Function
    let razorpayOrderId: string | null = null;
    let razorpayAmount = Math.round(amount * 100);

    try {
      const res = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount, receipt: dbOrderId || `manual_${Date.now()}` },
      });

      if (!res.error && res.data?.id) {
        razorpayOrderId = res.data.id;
        razorpayAmount = res.data.amount;
      } else {
        console.warn('Edge function error, proceeding without server order:', res.error || res.data?.error);
      }
    } catch (err) {
      console.warn('create-razorpay-order unavailable, proceeding without server order_id:', err);
    }

    // 3. Open Razorpay checkout modal
    const options: any = {
      key: razorpayKeyId,
      amount: razorpayAmount,
      currency: 'INR',
      name: 'SK Mobiles',
      description,
      image: '/favicon.ico',
      ...(razorpayOrderId ? { order_id: razorpayOrderId } : {}),
      handler: async function (response: any) {
        // 4. Verify on backend if we have a server order
        if (razorpayOrderId && dbOrderId) {
          try {
            const verifyRes = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: dbOrderId,
                table: dbTable,
              },
            });
            if (verifyRes.error) throw new Error(verifyRes.error.message || 'Verification failed');
          } catch (verifyErr: any) {
            console.error('Payment verification error:', verifyErr);
            toast({
              title: 'Verification issue',
              description: 'Payment received but verification had an error. Please contact support with payment ID: ' + response.razorpay_payment_id,
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }
        }

        toast({ title: 'Payment Successful! ✅', description: `Payment ID: ${response.razorpay_payment_id}` });
        onSuccess?.(response.razorpay_payment_id, response.razorpay_order_id);
        setLoading(false);
      },
      prefill: {
        name: prefill?.name || '',
        email: prefill?.email || '',
        contact: prefill?.contact || '',
      },
      theme: { color: '#0ea5e9' },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response: any) {
      console.error('Razorpay payment failed:', response.error);
      toast({
        title: 'Payment Failed',
        description: response.error?.description || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      onFailure?.(response.error);
      setLoading(false);
    });

    rzp.open();
    // Note: setLoading(false) is called inside handler/failed, not here
    // because the modal stays open until user acts
  };

  return (
    <Button
      onClick={handlePay}
      disabled={disabled || loading || !amount}
      className={`gap-2 neon-glow ${className}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      {loading ? 'Opening payment...' : label}
    </Button>
  );
}
