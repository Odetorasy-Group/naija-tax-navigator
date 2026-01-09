import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FeatureGate } from "@/components/FeatureGate";

interface ParsedEmployee {
  full_name: string;
  monthly_gross: number;
  has_pension: boolean;
  has_nhf: boolean;
  annual_rent: number;
  insurance_premium: number;
}

interface BulkUploadProps {
  onUploadComplete: () => void;
}

export function BulkUpload({ onUploadComplete }: BulkUploadProps) {
  const { user, isPro } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<ParsedEmployee[]>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      toast.error("Please upload an Excel (.xlsx) or CSV file");
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const parsed: ParsedEmployee[] = jsonData.map((row: any) => ({
        full_name: row["Name"] || row["Full Name"] || row["Employee"] || row["name"] || "",
        monthly_gross: parseFloat(row["Gross"] || row["Monthly Gross"] || row["Salary"] || row["gross"] || 0),
        has_pension: row["Pension"] === true || row["Pension"] === "Yes" || row["pension"] === true || true,
        has_nhf: row["NHF"] === true || row["NHF"] === "Yes" || row["nhf"] === true || false,
        annual_rent: parseFloat(row["Rent"] || row["Annual Rent"] || row["rent"] || 0),
        insurance_premium: parseFloat(row["Insurance"] || row["Life Insurance"] || row["insurance"] || 0),
      })).filter(emp => emp.full_name && emp.monthly_gross > 0);

      if (parsed.length === 0) {
        toast.error("No valid employee data found. Please check column names.");
        return;
      }

      setPreview(parsed);
      toast.success(`Found ${parsed.length} employees to import`);
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.error("Error reading file. Please check the format.");
    }
  };

  const handleImport = async () => {
    if (!user || preview.length === 0) return;

    setIsUploading(true);

    try {
      const employeesToInsert = preview.map(emp => ({
        ...emp,
        user_id: user.id,
      }));

      const { error } = await supabase
        .from("employees")
        .insert(employeesToInsert);

      if (error) throw error;

      toast.success(`Successfully imported ${preview.length} employees`);
      setPreview([]);
      onUploadComplete();
    } catch (error: any) {
      console.error("Import error:", error);
      toast.error(error.message || "Failed to import employees");
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const content = (
    <div className="card-bento">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Bulk Upload</h3>
          <p className="text-sm text-muted-foreground">Import employees from Excel or CSV</p>
        </div>
      </div>

      {preview.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-3">
            Drop your Excel/CSV file here or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="hidden"
            id="bulk-upload"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Expected columns: Name, Gross, Pension, NHF, Rent, Insurance
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{preview.length} employees ready to import</span>
          </div>
          
          <div className="max-h-48 overflow-y-auto border border-border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="text-left p-2 font-medium">Name</th>
                  <th className="text-right p-2 font-medium">Gross</th>
                  <th className="text-center p-2 font-medium">Pension</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 10).map((emp, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2">{emp.full_name}</td>
                    <td className="p-2 text-right tabular-nums">₦{emp.monthly_gross.toLocaleString()}</td>
                    <td className="p-2 text-center">{emp.has_pension ? "Yes" : "No"}</td>
                  </tr>
                ))}
                {preview.length > 10 && (
                  <tr className="border-t border-border bg-muted/50">
                    <td colSpan={3} className="p-2 text-center text-muted-foreground">
                      ...and {preview.length - 10} more
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? "Importing..." : `Import ${preview.length} Employees`}
            </Button>
            <Button variant="outline" onClick={clearPreview}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (!isPro) {
    return (
      <FeatureGate 
        feature="Bulk Upload" 
        description="Import multiple employees at once from Excel or CSV files"
      >
        {content}
      </FeatureGate>
    );
  }

  return content;
}
