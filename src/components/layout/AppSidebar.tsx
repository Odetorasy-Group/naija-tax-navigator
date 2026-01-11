import { useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calculator, 
  Target, 
  Users, 
  Globe, 
  Settings,
  Shield
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/Tax Suite.jpg";

const mainNavItems = [
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: LayoutDashboard,
  },
  { 
    title: "Quick Calculator", 
    url: "/calculator", 
    icon: Calculator,
  },
  { 
    title: "Income Targeter", 
    url: "/targeter", 
    icon: Target,
  },
  { 
    title: "Payroll Manager", 
    url: "/payroll", 
    icon: Users,
    badge: "3 Staff"
  },
  { 
    title: "Global View", 
    url: "/global", 
    icon: Globe,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { profile } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const displayName = profile?.display_name || profile?.email?.split("@")[0];

  return (
    <Sidebar 
      className={collapsed ? "w-14" : "w-[280px]"}
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="Odetorasy Tax Suite" 
            className="w-10 h-10 object-contain rounded-md"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-serif font-semibold text-foreground">
                Odetorasy
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary" />
                Tax Suite
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2">
            {!collapsed && "Main"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <NavLink 
                      to={item.url} 
                      end 
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors hover:bg-accent"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                      {!collapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                      {!collapsed && item.badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-2">
        <SidebarSeparator className="mb-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isActive("/settings")}
              tooltip={collapsed ? "Settings" : undefined}
            >
              <NavLink 
                to="/settings" 
                end 
                className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors hover:bg-accent"
                activeClassName="bg-primary/10 text-primary font-medium"
              >
                <Settings className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                {!collapsed && <span className="flex-1">Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {!collapsed && displayName && (
          <div className="mx-3 mt-3 p-3 rounded-md bg-accent/50">
            <p className="text-sm font-medium text-foreground truncate">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}