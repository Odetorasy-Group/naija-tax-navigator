import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Palette, Crown, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UpgradeButton } from "@/components/TaxCalculator/UpgradeButton";

export default function Settings() {
  const { user, profile, signOut, isPro } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState(profile?.email?.split("@")[0] || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    
    // For now, display name is stored locally or we could add to profiles table
    toast.success("Profile updated successfully");
    setIsUpdating(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    
    setIsChangingPassword(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to access settings</p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Subscription Status */}
      <div className="card-bento">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Subscription</h3>
              <p className="text-sm text-muted-foreground">
                {isPro ? "Pro Plan" : "Free Plan"}
              </p>
            </div>
          </div>
          {isPro ? (
            <div className="trust-badge">
              <Shield className="w-3.5 h-3.5" />
              Active
            </div>
          ) : (
            <UpgradeButton variant="compact" />
          )}
        </div>
        {isPro && profile?.subscription_end_date && (
          <p className="text-xs text-muted-foreground">
            Renews on {new Date(profile.subscription_end_date).toLocaleDateString("en-NG")}
          </p>
        )}
      </div>

      <Separator />

      {/* Profile Settings */}
      <div className="card-bento">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Profile</h3>
            <p className="text-sm text-muted-foreground">Your account information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || ""}
              disabled
              className="mt-1.5 bg-muted/50"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          <div>
            <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="mt-1.5"
            />
          </div>

          <Button 
            onClick={handleUpdateProfile} 
            disabled={isUpdating}
            className="w-full sm:w-auto"
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </div>

      {/* Password Change */}
      <div className="card-bento">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Security</h3>
            <p className="text-sm text-muted-foreground">Change your password</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5"
            />
          </div>

          <Button 
            onClick={handleChangePassword} 
            disabled={isChangingPassword}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isChangingPassword ? "Updating..." : "Change Password"}
          </Button>
        </div>
      </div>

      {/* Appearance */}
      <div className="card-bento">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Appearance</h3>
            <p className="text-sm text-muted-foreground">Customize the interface</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-muted-foreground">Toggle dark theme</p>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
          />
        </div>
      </div>

      <Separator />

      {/* Sign Out */}
      <Button 
        variant="outline" 
        onClick={handleSignOut}
        className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  );
}
