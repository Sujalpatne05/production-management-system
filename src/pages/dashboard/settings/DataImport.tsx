import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { ArrowLeft, Upload, AlertCircle, CheckCircle2 } from "lucide-react";

interface ImportData {
  products?: Array<{
    name: string;
    code: string;
    unit?: string;
    price?: number;
    cost?: number;
    stock?: number;
  }>;
  rawMaterials?: Array<{
    name: string;
    code: string;
    unit?: string;
    price?: number;
    stock?: number;
    minStock?: number;
  }>;
  sales?: Array<{
    quantity: number;
    price: number;
    date?: string;
  }>;
  productions?: Array<{
    quantity: number;
    plannedStartDate: string;
    plannedEndDate: string;
  }>;
}

const DataImport = () => {
  const navigate = useNavigate();
  const store = useStore();
  const [importType, setImportType] = useState<keyof ImportData | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [importMessage, setImportMessage] = useState("");
  const [previewData, setPreviewData] = useState<any[]>([]);

  const parseCSV = (content: string): string[][] => {
    const lines = content.trim().split("\n");
    return lines.map((line) =>
      line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setImportStatus("loading");
    setImportMessage("Reading file...");

    try {
      const content = await uploadedFile.text();
      const rows = parseCSV(content);

      if (rows.length > 1) {
        setPreviewData(rows.slice(0, 5));
        setImportStatus("idle");
        setImportMessage("File ready for import. Click Import Data to proceed.");
      }
    } catch (error) {
      setImportStatus("error");
      setImportMessage("Error reading file. Please check the format.");
    }
  };

  const handleImport = async () => {
    if (!file || !importType) {
      setImportMessage("Please select import type and file");
      return;
    }

    setImportStatus("loading");
    setImportProgress(0);

    try {
      const content = await file.text();
      const rows = parseCSV(content);
      const headers = rows[0];
      const dataRows = rows.slice(1);

      let importedCount = 0;

      if (importType === "products") {
        dataRows.forEach((row) => {
          const product = {
            name: row[headers.indexOf("name")] || "Unknown",
            categoryId: "1",
            sku: row[headers.indexOf("code")] || `PROD-${Date.now()}`,
            price: parseFloat(row[headers.indexOf("price")] || "0"),
            cost: parseFloat(row[headers.indexOf("cost")] || "0"),
            stock: parseInt(row[headers.indexOf("stock")] || "0"),
            unit: row[headers.indexOf("unit")] || "piece",
            status: "active" as const,
          };
          store.addProduct(product);
          importedCount++;
          setImportProgress(Math.round(((importedCount) / dataRows.length) * 100));
        });
      } else if (importType === "rawMaterials") {
        dataRows.forEach((row) => {
          const rawMaterial = {
            name: row[headers.indexOf("name")] || "Unknown",
            categoryId: "1",
            sku: row[headers.indexOf("code")] || `RM-${Date.now()}`,
            price: parseFloat(row[headers.indexOf("price")] || "0"),
            stock: parseInt(row[headers.indexOf("stock")] || "0"),
            unit: row[headers.indexOf("unit")] || "kg",
            minStock: parseInt(row[headers.indexOf("minStock")] || "10"),
          };
          store.addRawMaterial(rawMaterial);
          importedCount++;
          setImportProgress(Math.round((importedCount / dataRows.length) * 100));
        });
      } else if (importType === "sales") {
        dataRows.forEach((row) => {
          const sale = {
            invoiceNo: `INV-${Date.now()}`,
            customerId: "1",
            items: [
              {
                productId: "1",
                quantity: parseInt(row[headers.indexOf("quantity")] || "1"),
                price: parseFloat(row[headers.indexOf("price")] || "0"),
              }
            ],
            total: parseFloat(row[headers.indexOf("price")] || "0") * parseInt(row[headers.indexOf("quantity")] || "1"),
            paid: 0,
            due: parseFloat(row[headers.indexOf("price")] || "0") * parseInt(row[headers.indexOf("quantity")] || "1"),
            date: row[headers.indexOf("date")] || new Date().toISOString().split("T")[0],
            status: "unpaid" as const,
          };
          store.addSale(sale);
          importedCount++;
          setImportProgress(Math.round((importedCount / dataRows.length) * 100));
        });
      } else if (importType === "productions") {
        dataRows.forEach((row) => {
          const production = {
            referenceNo: `PRD-${Date.now()}`,
            productId: "1",
            quantity: parseInt(row[headers.indexOf("quantity")] || "1"),
            startDate: row[headers.indexOf("plannedStartDate")] || new Date().toISOString(),
            endDate: row[headers.indexOf("plannedEndDate")] || undefined,
            stage: "setup",
            notes: "Imported from CSV",
            status: "running" as const,
          };
          store.addProduction(production);
          importedCount++;
          setImportProgress(Math.round((importedCount / dataRows.length) * 100));
        });
      }

      setImportStatus("success");
      setImportMessage(`Successfully imported ${importedCount} records!`);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setImportStatus("error");
      setImportMessage("Error importing data. Please check your file format.");
      console.error("Import error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/settings")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">Data Import</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">1</div>
              <p className="text-sm font-medium">Select Import Type</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">2</div>
              <p className="text-sm font-medium">Upload CSV File</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <p className="text-sm font-medium">Review & Import</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Type to Import *</label>
            <Select value={importType} onValueChange={(value) => setImportType(value as keyof ImportData)}>
              <SelectTrigger>
                <SelectValue placeholder="Select import type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="rawMaterials">Raw Materials</SelectItem>
                <SelectItem value="sales">Sales Orders</SelectItem>
                <SelectItem value="productions">Production Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload CSV File *</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">
                  {file ? file.name : "Click to upload or drag CSV file"}
                </p>
                <p className="text-xs text-gray-500 mt-1">CSV format only, max 10MB</p>
              </label>
            </div>
          </div>

          {previewData.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview (First 5 rows)</label>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <tbody>
                    {previewData.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className={idx === 0 ? "bg-gray-100 font-medium" : ""}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="border px-2 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {importStatus !== "idle" && (
            <div
              className={`p-4 rounded-lg flex items-start gap-3 ${
                importStatus === "success"
                  ? "bg-green-50 border border-green-200"
                  : importStatus === "error"
                    ? "bg-red-50 border border-red-200"
                    : "bg-blue-50 border border-blue-200"
              }`}
            >
              {importStatus === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : importStatus === "error" ? (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Upload className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    importStatus === "success"
                      ? "text-green-900"
                      : importStatus === "error"
                        ? "text-red-900"
                        : "text-blue-900"
                  }`}
                >
                  {importMessage}
                </p>
                {importStatus === "loading" && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/settings")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || !importType || importStatus === "loading"}
            >
              {importStatus === "loading" ? "Importing..." : "Import Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CSV File Format Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">📦 Products Format</h3>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
name,code,unit,price,cost,stock
Laptop,PROD-001,piece,50000,35000,10
Mouse,PROD-002,piece,1500,1000,50
            </pre>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm">🏭 Raw Materials Format</h3>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
name,code,unit,price,stock,minStock
Steel,RM-001,kg,500,100,20
Plastic,RM-002,kg,300,50,10
            </pre>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm">📊 Sales Orders Format</h3>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
quantity,price,date
2,50000,2024-01-15
5,1500,2024-01-15
            </pre>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm">🏗️ Production Orders Format</h3>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
quantity,plannedStartDate,plannedEndDate
10,2024-01-20,2024-01-25
50,2024-01-20,2024-01-22
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImport;
