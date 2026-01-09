import { useState } from "react";
import { GlobalView } from "@/components/TaxCalculator/GlobalView";

export default function Global() {
  const [sharedGross] = useState(500000);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          Global View
        </h1>
        <p className="text-muted-foreground mt-1">
          Convert Nigerian salaries to international currencies
        </p>
      </div>

      <GlobalView sharedGross={sharedGross} />
    </div>
  );
}
