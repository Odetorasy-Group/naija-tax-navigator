import { useState, useEffect } from "react";
import { Users, Plus, Trash2, Download, AlertCircle, ExternalLink } from "lucide-react";
import { calculateTax, formatCurrency } from "@/lib/taxCalculations";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BulkUpload } from "./BulkUpload";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  full_name: string;
  monthly_gross: number;
  annual_rent: number;
  insurance_premium: number;
  has_pension: boolean;
  has_nhf: boolean;
}

interface EmployeeWithCalc extends Employee {
  payeTax: number;
  pension: number;
  nhf: number;
  rentRelief: number;
  netPay: number;
}

const FREE_EMPLOYEE_LIMIT = 3;

export function PayrollManager() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees from database
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setEmployees([]);
      setLoading(false);
      return;
    }

    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        toast({
          title: "Error loading employees",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setEmployees(data || []);
      }
      setLoading(false);
    };

    fetchEmployees();
  }, [user, authLoading, toast]);

  const canAddEmployee = employees.length < FREE_EMPLOYEE_LIMIT;

  const employeesWithCalc: EmployeeWithCalc[] = employees.map((emp) => {
    if (emp.monthly_gross <= 0) {
      return { ...emp, payeTax: 0, pension: 0, nhf: 0, rentRelief: 0, netPay: 0 };
    }

    const result = calculateTax({
      grossSalary: emp.monthly_gross,
      isAnnual: false,
      annualRent: emp.annual_rent || 0,
      pensionEnabled: emp.has_pension,
      nhfEnabled: emp.has_nhf,
      lifeAssuranceEnabled: false,
      lifeInsurancePaid: emp.insurance_premium || 0,
    });

    return {
      ...emp,
      payeTax: result.monthlyTax,
      pension: result.pensionDeduction / 12,
      nhf: result.nhfDeduction / 12,
      rentRelief: result.rentRelief / 12,
      netPay: result.monthlyTakeHome,
    };
  });

  const totals = employeesWithCalc.reduce(
    (acc, emp) => ({
      gross: acc.gross + emp.monthly_gross,
      tax: acc.tax + emp.payeTax,
      pension: acc.pension + emp.pension,
      nhf: acc.nhf + emp.nhf,
      net: acc.net + emp.netPay,
    }),
    { gross: 0, tax: 0, pension: 0, nhf: 0, net: 0 }
  );

  const addEmployee = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to add employees.",
        variant: "destructive",
      });
      return;
    }

    if (!canAddEmployee) {
      toast({
        title: "Limit Reached",
        description: "Free plan is limited to 3 employees. Check out PayShield Nigeria for enterprise payroll.",
      });
      return;
    }

    const { data, error } = await supabase
      .from("employees")
      .insert({
        user_id: user.id,
        full_name: "",
        monthly_gross: 0,
        annual_rent: 0,
        insurance_premium: 0,
        has_pension: true,
        has_nhf: true,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding employee",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setEmployees([...employees, data]);
    }
  };

  const updateEmployee = async (id: string, field: keyof Employee, value: string | number | boolean) => {
    // Update local state immediately for responsiveness
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    );

    // Debounced database update
    const { error } = await supabase
      .from("employees")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating employee",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteEmployee = async (id: string) => {
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error deleting employee",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const handleGrossChange = (id: string, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    updateEmployee(id, "monthly_gross", cleanValue ? parseInt(cleanValue, 10) : 0);
  };

  const handleRentChange = (id: string, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    updateEmployee(id, "annual_rent", cleanValue ? parseInt(cleanValue, 10) : 0);
  };

  const handleInsuranceChange = (id: string, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    updateEmployee(id, "insurance_premium", cleanValue ? parseInt(cleanValue, 10) : 0);
  };

  const exportCSV = () => {
    const headers = ["Employee Name", "Monthly Gross", "Annual Rent", "Life Insurance", "PAYE Tax", "Pension", "NHF", "Net Pay"];
    const rows = employeesWithCalc.map((emp) => [
      emp.full_name || "Unnamed",
      emp.monthly_gross,
      emp.annual_rent,
      emp.insurance_premium,
      Math.round(emp.payeTax),
      Math.round(emp.pension),
      Math.round(emp.nhf),
      Math.round(emp.netPay),
    ]);

    const totalsRow = [
      "TOTALS",
      totals.gross,
      "",
      "",
      Math.round(totals.tax),
      Math.round(totals.pension),
      Math.round(totals.nhf),
      Math.round(totals.net),
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      totalsRow.join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payroll-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card-elevated p-8 text-center animate-slide-up">
        <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Sign in to Access Payroll</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create an account to manage employees and run payroll calculations.
        </p>
        <Button onClick={() => window.location.href = "/auth"} className="gap-2">
          Sign In to Continue
        </Button>
      </div>
    );
  }

  const refetchEmployees = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("employees")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (data) setEmployees(data);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Bulk Upload Section */}
      <BulkUpload onUploadComplete={refetchEmployees} />

      {/* Free Tier Limit - PayShield Promo */}
      {employees.length >= FREE_EMPLOYEE_LIMIT && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Need More Employees?
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                This free tool supports up to {FREE_EMPLOYEE_LIMIT} employees. For enterprise payroll, 
                compliance automation, and unlimited staff management, check out <strong>PayShield Nigeria</strong> — 
                our comprehensive payroll solution for SMEs and corporations.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => toast({
                  title: "Coming Soon!",
                  description: "PayShield Nigeria is launching soon. Stay tuned for enterprise-grade payroll management.",
                })}
              >
                Learn About PayShield
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="card-elevated p-4 md:p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Employee Payroll
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {employees.length}/{FREE_EMPLOYEE_LIMIT}
            </span>
          </h2>
          <Button
            onClick={addEmployee}
            size="sm"
            className="gap-1.5"
            disabled={!canAddEmployee}
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>

        {employees.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No employees added yet</p>
            <p className="text-sm">Click "Add Employee" to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Name</TableHead>
                  <TableHead className="min-w-[110px]">Monthly Gross</TableHead>
                  <TableHead className="min-w-[100px]">Annual Rent</TableHead>
                  <TableHead className="min-w-[100px]">Life Ins. (Prev Yr)</TableHead>
                  <TableHead className="min-w-[90px]">PAYE Tax</TableHead>
                  <TableHead className="min-w-[90px]">Pension</TableHead>
                  <TableHead className="min-w-[90px]">Net Pay</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeesWithCalc.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <input
                        type="text"
                        value={emp.full_name}
                        onChange={(e) => updateEmployee(emp.id, "full_name", e.target.value)}
                        placeholder="Employee name"
                        className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          ₦
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={emp.monthly_gross > 0 ? emp.monthly_gross.toLocaleString("en-NG") : ""}
                          onChange={(e) => handleGrossChange(emp.id, e.target.value.replace(/,/g, ""))}
                          placeholder="0"
                          className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 pl-4 text-sm font-medium"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          ₦
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={emp.annual_rent > 0 ? emp.annual_rent.toLocaleString("en-NG") : ""}
                          onChange={(e) => handleRentChange(emp.id, e.target.value.replace(/,/g, ""))}
                          placeholder="0"
                          className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 pl-4 text-sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          ₦
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={emp.insurance_premium > 0 ? emp.insurance_premium.toLocaleString("en-NG") : ""}
                          onChange={(e) => handleInsuranceChange(emp.id, e.target.value.replace(/,/g, ""))}
                          placeholder="0"
                          className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 pl-4 text-sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-destructive font-medium text-sm">
                      {emp.payeTax > 0 ? formatCurrency(emp.payeTax) : "-"}
                    </TableCell>
                    <TableCell className="text-warning font-medium text-sm">
                      {emp.pension > 0 ? formatCurrency(emp.pension) : "-"}
                    </TableCell>
                    <TableCell className="text-primary font-semibold text-sm">
                      {emp.netPay > 0 ? formatCurrency(emp.netPay) : "-"}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => deleteEmployee(emp.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {employees.length > 0 && totals.gross > 0 && (
        <>
          {/* Summary Card */}
          <div className="card-elevated p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Remittance Summary</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Total Gross</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(totals.gross)}</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <p className="text-xs text-muted-foreground mb-1">Total Tax to Remit</p>
                <p className="text-lg font-bold text-destructive">{formatCurrency(totals.tax)}</p>
              </div>
              <div className="p-3 rounded-xl bg-warning/10">
                <p className="text-xs text-muted-foreground mb-1">Total Pension</p>
                <p className="text-lg font-bold text-warning">{formatCurrency(totals.pension)}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <p className="text-xs text-muted-foreground mb-1">Total Net Outflow</p>
                <p className="text-lg font-bold text-primary">{formatCurrency(totals.net)}</p>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex gap-3">
            <Button onClick={exportCSV} variant="outline" className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Export Payroll CSV
            </Button>
          </div>
        </>
      )}
    </div>
  );
}