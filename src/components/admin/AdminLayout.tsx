import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

export default function AdminLayout() {
  const { isAdminAuthenticated } = useAdmin();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 glass">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold gradient-text">skmobiles Admin</h1>
          </header>
          <main className="flex-1 p-6 overflow-auto custom-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
