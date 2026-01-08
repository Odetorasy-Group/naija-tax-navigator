import { useState, useEffect } from "react";
import { Users, Plus, Trash2, Download } from "lucide-react";
import { calculateTax, formatCurrency, PENSION_RATE, NHF_RATE } from "@/lib/taxCalculations";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Employee {
  id: string;
  name: string;
  monthlyGross: number;
  annualRent: number;
  lifeInsurance: number;
}

interface EmployeeWithCalc extends Employee {
  payeTax: number;
  pension: number;
  nhf: number;
  rentRelief: number;
  netPay: number;
}

const STORAGE_KEY = "odetorasy-payroll-employees";

export function PayrollManager() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const employeesWithCalc: EmployeeWithCalc[] = employees.map((emp) => {
    if (emp.monthlyGross <= 0) {
      return { ...emp, payeTax: 0, pension: 0, nhf: 0, rentRelief: 0, netPay: 0 };
    }
    
    const result = calculateTax({
      grossSalary: emp.monthlyGross,
      isAnnual: false,
      annualRent: emp.annualRent || 0,
      pensionEnabled: true,
      nhfEnabled: true,
      lifeAssuranceEnabled: false,
      lifeInsurancePaid: emp.lifeInsurance || 0,
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
      gross: acc.gross + emp.monthlyGross,
      tax: acc.tax + emp.payeTax,
      pension: acc.pension + emp.pension,
      nhf: acc.nhf + emp.nhf,
      net: acc.net + emp.netPay,
    }),
    { gross: 0, tax: 0, pension: 0, nhf: 0, net: 0 }
  );

  const addEmployee = () => {
    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      name: "",
      monthlyGross: 0,
      annualRent: 0,
      lifeInsurance: 0,
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: string, field: keyof Employee, value: string | number) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const handleGrossChange = (id: string, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    updateEmployee(id, "monthlyGross", cleanValue ? parseInt(cleanValue, 10) : 0);
  };

  const handleRentChange = (id: string, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    updateEmployee(id, "annualRent", cleanValue ? parseInt(cleanValue, 10) : 0);
  };

  const handleInsuranceChange = (id: string, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    updateEmployee(id, "lifeInsurance", cleanValue ? parseInt(cleanValue, 10) : 0);
  };

  const exportCSV = () => {
    const headers = ["Employee Name", "Monthly Gross", "Annual Rent", "Life Insurance", "PAYE Tax", "Pension", "NHF", "Net Pay"];
    const rows = employeesWithCalc.map((emp) => [
      emp.name || "Unnamed",
      emp.monthlyGross,
      emp.annualRent,
      emp.lifeInsurance,
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

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="card-elevated p-4 md:p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Employee Payroll
          </h2>
          <Button onClick={addEmployee} size="sm" className="gap-1.5">
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
                        value={emp.name}
                        onChange={(e) => updateEmployee(emp.id, "name", e.target.value)}
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
                          value={emp.monthlyGross > 0 ? emp.monthlyGross.toLocaleString("en-NG") : ""}
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
                          value={emp.annualRent > 0 ? emp.annualRent.toLocaleString("en-NG") : ""}
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
                          value={emp.lifeInsurance > 0 ? emp.lifeInsurance.toLocaleString("en-NG") : ""}
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
          <Button onClick={exportCSV} variant="outline" className="w-full gap-2">
            <Download className="w-4 h-4" />
            Export Payroll CSV
          </Button>
        </>
      )}
    </div>
  );
}
