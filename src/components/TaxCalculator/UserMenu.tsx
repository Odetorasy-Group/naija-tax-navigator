import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Crown, Settings } from "lucide-react";
import { UpgradeButton } from "./UpgradeButton";

export function UserMenu() {
  const { user, profile, signOut, isPro } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    navigate("/auth");
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/auth")}
        className="gap-2"
      >
        <User className="w-4 h-4" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            {isPro ? (
              <Crown className="w-3.5 h-3.5 text-primary" />
            ) : (
              <User className="w-3.5 h-3.5 text-primary" />
            )}
          </div>
          <span className="hidden sm:inline max-w-[120px] truncate">
            {profile?.email?.split("@")[0] || "Account"}
          </span>
          {isPro && (
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
              PRO
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium truncate">{profile?.email}</p>
          <p className="text-xs text-muted-foreground">
            {isPro ? "Pro Plan" : "Free Plan"}
          </p>
        </div>
        <DropdownMenuSeparator />
        {!isPro && (
          <>
            <div className="p-2">
              <UpgradeButton variant="compact" />
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem disabled>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isLoading}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
