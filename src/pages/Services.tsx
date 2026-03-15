import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Smartphone, Wrench, Video, MessageSquare } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number is required'),
  problem_description: z.string().min(10, 'Please describe the problem in detail'),
  request_type: z.enum(['repair', 'consultation', 'video_call']),
  preferred_time: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Services() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      request_type: 'repair',
    }
  });

  const requestType = watch('request_type');

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('service_requests' as any).insert([
        {
          name: data.name,
          phone: data.phone,
          problem_description: data.problem_description,
          request_type: data.request_type,
          preferred_time: data.preferred_time ? new Date(data.preferred_time).toISOString() : null,
        }
      ]);

      if (error) throw error;

      toast.success('Service request submitted successfully! We will contact you soon.');
      reset();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to submit service request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 font-outfit text-primary">Mobile Services</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Need a repair, expert advice, or remote diagnostics? We've got you covered.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="space-y-8">
          <div className="bg-card border border-border/50 rounded-2xl p-6 flex gap-4 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="bg-primary/10 p-3 rounded-full h-fit">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Mobile Repair</h3>
              <p className="text-muted-foreground">Screen replacements, battery issues, water damage recovery, and hardware fixes by certified technicians.</p>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 flex gap-4 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="bg-primary/10 p-3 rounded-full h-fit">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Expert Consultation</h3>
              <p className="text-muted-foreground">Not sure which phone to buy? Or need help setting up your new device? Book an in-store consultation.</p>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 flex gap-4 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="bg-primary/10 p-3 rounded-full h-fit">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Video Diagnostics</h3>
              <p className="text-muted-foreground">Book a video call to diagnose software problems or to get a preliminary assessment before visiting the store.</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-8">
          <h2 className="text-2xl font-bold mb-6">Book a Service</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Service Type</label>
              <Select onValueChange={(val) => setValue('request_type', val as any)} defaultValue={requestType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="repair">Mobile Repair</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="video_call">Video Call (Diagnostics)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <Input {...register('name')} placeholder="John Doe" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input {...register('phone')} placeholder="+91 8688575044" />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Problem Description</label>
              <Textarea 
                {...register('problem_description')} 
                placeholder="Please describe the issue with your device..." 
                className="h-32"
              />
              {errors.problem_description && <p className="text-red-500 text-sm mt-1">{errors.problem_description.message}</p>}
            </div>

            {(requestType === 'video_call' || requestType === 'consultation') && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium mb-2">Preferred Time</label>
                <Input type="datetime-local" {...register('preferred_time')} />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
