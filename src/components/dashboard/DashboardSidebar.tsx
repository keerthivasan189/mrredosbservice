import {
  LayoutDashboard, Car, Wrench, Gift, FileText, Bell, User, LogOut, CalendarPlus, CreditCard,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/mr-red-logo-transparent.png";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Book Service", url: "/dashboard/book", icon: CalendarPlus },
  { title: "My Bookings", url: "/dashboard/bookings", icon: FileText },
  { title: "Vehicles", url: "/dashboard/vehicles", icon: Car },
  { title: "Services", url: "/dashboard/services", icon: Wrench },
  { title: "Loyalty", url: "/dashboard/loyalty", icon: Gift },
  { title: "Payments", url: "/dashboard/payments", icon: CreditCard },
  { title: "Reminders", url: "/dashboard/reminders", icon: Bell },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

const DashboardSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { profile, signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <div className="h-16 flex items-center gap-2 px-4 border-b border-border/30">
        <img src={logo} alt="Mr Red OSB Service" className="brand-logo h-10 w-auto max-w-[9rem] flex-shrink-0" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
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

      <SidebarFooter className="border-t border-border/30 p-3">
        {!collapsed && (
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2 min-w-0">
              {profile?.profile_photo ? (
                <img src={profile.profile_photo} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{profile?.name || "User"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{profile?.email}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        )}
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Sign Out"}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
