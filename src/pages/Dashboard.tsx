import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Wallet, 
  Home, 
  Calendar, 
  ArrowUpRight,
  TrendingUp,
  Calculator,
  Users,
  ChevronRight,
  LogIn,
  Save
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { calculateTax, formatCurrency, TaxInputs } from "@/lib/taxCalculations";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const { user, isPro, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [totalPayroll, setTotalPayroll] = useState(0);
  const [savedSalary, setSavedSalary] = useState(0);
  const [rentPaid, setRentPaid] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
      fetchDashboardData();
    } else {
      setDataLoading(false);
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setDataLoading(true);

    // Fetch employees
    const { data: employees } = await supabase
      .from("employees")
      .select("*")
      .eq("user_id", user.id);

    if (employees) {
      setEmployeeCount(employees.length);
      const total = employees.reduce((sum, emp) => sum + Number(emp.monthly_gross), 0);
      setTotalPayroll(total);
    }

    // Fetch global settings for saved salary
    const { data: settings } = await supabase
      .from("global_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (settings) {
      setRentPaid(Number(settings.annual_rent) || 0);
      setSavedSalary(Number((settings as any).saved_salary) || 0);
    }

    setDataLoading(false);
  };

  const displayName = profile?.display_name || profile?.email?.split("@")[0] || "User";

  const defaultInputs: TaxInputs = {
    grossSalary: savedSalary || 500000,
    isAnnual: false,
    annualRent: rentPaid,
    pensionEnabled: true,
    nhfEnabled: false,
    lifeAssuranceEnabled: false,
  };

  const result = useMemo(() => calculateTax(defaultInputs), [savedSalary, rentPaid]);

  // Generate sample chart data
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, i) => ({
      month,
      takeHome: result.monthlyTakeHome * (0.95 + Math.random() * 0.1),
      tax: result.monthlyTax * (0.9 + Math.random() * 0.2),
    }));
  }, [result]);

  // Calculate rent relief progress (capped at ₦500,000)
  const rentReliefCap = 500000;
  const rentRelief = Math.min(rentPaid * 0.2, rentReliefCap);
  const rentReliefProgress = (rentRelief / rentReliefCap) * 100;

  // Next tax due date (assume quarterly)
  const nextTaxDue = new Date();
  nextTaxDue.setMonth(Math.ceil((nextTaxDue.getMonth() + 1) / 3) * 3);
  nextTaxDue.setDate(21);

  // Loading state
  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Not signed in - show sign in prompt
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[500px] animate-fade-in">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Welcome to Odetorasy Tax Suite
          </h1>
          <p className="text-muted-foreground mb-6">
            Sign in to access your personalized tax dashboard, track your take-home pay, and manage payroll.
          </p>
          <Button onClick={() => navigate("/auth")} size="lg" className="gap-2">
            <LogIn className="w-4 h-4" />
            Sign In to Get Started
          </Button>
        </div>
      </div>
    );
  }

  // Signed in but no salary saved - show empty state
  if (savedSalary === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Welcome, {displayName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Let's set up your tax dashboard
          </p>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
              <Save className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              No Salary Data Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Use the Quick Calculator to compute your tax, then save your salary to see your personalized dashboard with take-home trends, rent relief progress, and tax due dates.
            </p>
            <Button onClick={() => navigate("/calculator")} size="lg" className="gap-2">
              <Calculator className="w-4 h-4" />
              Go to Calculator
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your tax overview for {new Date().toLocaleDateString("en-NG", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card A: Monthly Take-Home Summary (Large) */}
        <div className="md:col-span-2 lg:col-span-2 card-bento p-0 overflow-hidden">
          <div className="p-5 pb-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {isAnnual ? "Annual" : "Monthly"} Take-Home
                </p>
                <p className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">
                  {formatCurrency(isAnnual ? result.annualTakeHome : result.monthlyTakeHome)}
                </p>
                <div className="flex items-center gap-2 mt-2 text-success text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span className="tabular-nums">
                    {formatCurrency(result.monthlySavings)}/mo savings vs old law
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="h-32 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="takeHomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="takeHome"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#takeHomeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card B: Rent Relief Progress (Medium) */}
        <div className="card-bento">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rent Relief Used</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {formatCurrency(rentRelief)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
          </div>
          <Progress value={rentReliefProgress} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {rentReliefProgress.toFixed(0)}% of ₦500,000 cap
          </p>
        </div>

        {/* Card C: Next Tax Due Date (Medium) */}
        <div className="card-bento">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Next Tax Due</p>
              <p className="text-2xl font-bold text-foreground">
                {nextTaxDue.toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">Estimated Liability</p>
          <p className="text-lg font-semibold text-foreground tabular-nums">
            {formatCurrency(result.monthlyTax * 3)}
          </p>
        </div>

        {/* Card D: Quick Toggle (Small) */}
        <div className="card-bento flex flex-col justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-3">View Mode</p>
            <div className="flex items-center gap-3">
              <Label htmlFor="annual-toggle" className="text-sm font-medium">
                {isAnnual ? "Annual" : "Monthly"}
              </Label>
              <Switch
                id="annual-toggle"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Toggle between monthly and annual views
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="card-bento">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Monthly Tax</p>
                <p className="text-lg font-bold tabular-nums">{formatCurrency(result.monthlyTax)}</p>
              </div>
            </div>
            <Link to="/calculator">
              <Button variant="ghost" size="icon">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="card-bento">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">Effective Rate</p>
                <p className="text-lg font-bold tabular-nums">{result.effectiveRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 card-bento">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Payroll Staff</p>
                <p className="text-lg font-bold tabular-nums">
                  {employeeCount} {employeeCount === 1 ? "employee" : "employees"}
                </p>
              </div>
            </div>
            <Link to="/payroll">
              <Button variant="outline" size="sm" className="gap-2">
                Manage <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          {totalPayroll > 0 && (
            <p className="text-sm text-muted-foreground mt-3">
              Total Monthly Payroll: <span className="font-semibold tabular-nums">{formatCurrency(totalPayroll)}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}