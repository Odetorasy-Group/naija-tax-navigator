import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/TaxCalculator/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 h-14 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <div className="flex-1" />
      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
