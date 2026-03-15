import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Star, Trash } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from('reviews').select('*, product:products(name), user:profiles(full_name)').order('created_at', { ascending: false });
    if (data) setReviews(data);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
      toast.success('Review deleted');
      fetchReviews();
    } else {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Reviews Moderation</h2>
      </div>
      <Card>
        <CardHeader><CardTitle>All Reviews</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map(rev => (
                <TableRow key={rev.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{rev.product?.name || 'Unknown'}</TableCell>
                  <TableCell>{rev.user?.full_name || 'Anonymous'}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-1">{rev.rating}</span><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{rev.comment}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(rev.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
