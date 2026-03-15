import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, LogOut, AlertTriangle, Smartphone, Palette, Ticket, Wrench, MessageSquareQuote, CreditCard } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Dashboard', url: '/skadmin', icon: LayoutDashboard },
  { title: 'Brands & Models', url: '/skadmin/brands', icon: Smartphone },
  { title: 'Case Orders', url: '/skadmin/case-orders', icon: Palette },
  { title: 'Products', url: '/skadmin/products', icon: Package },
  { title: 'Categories', url: '/skadmin/categories', icon: FolderTree },
  { title: 'Orders', url: '/skadmin/orders', icon: ShoppingCart },
  { title: 'Coupons', url: '/skadmin/coupons', icon: Ticket },
  { title: 'Services', url: '/skadmin/service-requests', icon: Wrench },
  { title: 'Reviews', url: '/skadmin/reviews', icon: MessageSquareQuote },
  { title: 'Payment Setup', url: '/skadmin/payment-setup', icon: CreditCard },
  { title: 'Stock Alerts', url: '/skadmin/stock-alerts', icon: AlertTriangle },
  { title: 'Customers', url: '/skadmin/customers', icon: Users },
  { title: 'Settings', url: '/skadmin/settings', icon: Palette },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { adminLogout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/skadmin/login');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/admin'} className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && 'Logout'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
