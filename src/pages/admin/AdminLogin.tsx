import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { staticAdminLogin } from '@/contexts/AdminContext';

// Static admin credentials
const STATIC_ADMIN_USERNAME = 'skadmin';
const STATIC_ADMIN_PASSWORD = 'sk@mobiles2024';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staticUsername, setStaticUsername] = useState('');
  const [staticPassword, setStaticPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Supabase auth login
  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: 'Invalid credentials', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }
    navigate('/admin');
    setLoading(false);
  };

  // Static credentials login
  const handleStaticLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (staticUsername === STATIC_ADMIN_USERNAME && staticPassword === STATIC_ADMIN_PASSWORD) {
      staticAdminLogin();
      toast({ title: 'Welcome Admin!' });
      // Force a page reload to pick up the new session
      window.location.href = window.location.origin + (import.meta.env.BASE_URL || '/') + 'admin';
    } else {
      toast({ title: 'Invalid credentials', description: 'Username or password is incorrect', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl gradient-text">Admin Panel</CardTitle>
          <p className="text-muted-foreground text-sm">skmobiles Management</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="static" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="static">Admin Login</TabsTrigger>
              <TabsTrigger value="supabase">Email Login</TabsTrigger>
            </TabsList>
            <TabsContent value="static">
              <form onSubmit={handleStaticLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="username" value={staticUsername} onChange={e => setStaticUsername(e.target.value)} className="pl-10" placeholder="Enter admin username" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="static-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="static-password" type="password" value={staticPassword} onChange={e => setStaticPassword(e.target.value)} className="pl-10" placeholder="Enter password" required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="supabase">
              <form onSubmit={handleSupabaseLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" placeholder="Enter admin email" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" placeholder="Enter password" required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
