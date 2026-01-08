import { useState, useMemo } from "react";
import { Calculator, Target, Users, Globe, CreditCard } from "lucide-react";
import { SuiteHeader } from "./SuiteHeader";
import { StandardCalculator } from "./StandardCalculator";
import { IncomeTargeter } from "./IncomeTargeter";
import { PayrollManager } from "./PayrollManager";
import { GlobalView } from "./GlobalView";
import { PricingSection } from "./PricingSection";
import { ExpiredBanner } from "./ExpiredBanner";
import { Footer } from "./Footer";
import { calculateTax, TaxInputs } from "@/lib/taxCalculations";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export function TaxCalculator() {
  const [inputs, setInputs] = useState<TaxInputs>({
    grossSalary: 0,
    isAnnual: false,
    annualRent: 0,
    pensionEnabled: true,
    nhfEnabled: false,
    lifeAssuranceEnabled: false,
  });

  const result = useMemo(() => calculateTax(inputs), [inputs]);
  const monthlyTakeHome = inputs.grossSalary > 0 ? result.monthlyTakeHome : 0;

  // Shared gross for Global View - use monthly value
  const sharedGross = inputs.isAnnual ? inputs.grossSalary / 12 : inputs.grossSalary;

  const { isExpired, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-4 md:py-8 px-4">
        <SuiteHeader monthlyTakeHome={monthlyTakeHome} />
        
        {isExpired && <ExpiredBanner />}
        
        <div className="card-elevated p-4 md:p-6">
          <Tabs defaultValue="standard" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="standard" className="flex items-center gap-1.5 text-xs md:text-sm">
                <Calculator className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Calculator</span>
              </TabsTrigger>
              <TabsTrigger value="targeter" className="flex items-center gap-1.5 text-xs md:text-sm">
                <Target className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Targeter</span>
              </TabsTrigger>
              <TabsTrigger value="payroll" className="flex items-center gap-1.5 text-xs md:text-sm">
                <Users className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Payroll</span>
              </TabsTrigger>
              <TabsTrigger value="global" className="flex items-center gap-1.5 text-xs md:text-sm">
                <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Global</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-1.5 text-xs md:text-sm">
                <CreditCard className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Pricing</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="standard">
              <StandardCalculator inputs={inputs} onInputChange={setInputs} />
            </TabsContent>

            <TabsContent value="targeter">
              <IncomeTargeter />
            </TabsContent>

            <TabsContent value="payroll">
              <PayrollManager />
            </TabsContent>

            <TabsContent value="global">
              <GlobalView sharedGross={sharedGross} />
            </TabsContent>

            <TabsContent value="pricing">
              <PricingSection />
            </TabsContent>
          </Tabs>
        </div>

        <Footer />
      </div>
    </div>
  );
}
