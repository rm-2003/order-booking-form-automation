import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, MicrosoftExcelLogo, Check, X } from "@phosphor-icons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type ExcelUploaderProps = {
  obfId?: string;
};

export default function ExcelUploader({ obfId }: ExcelUploaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [previewData, setPreviewData] = useState<{
    manpower: any[];
    capex: any[];
    opex: any[];
    rental: any[];
  }>({
    manpower: [],
    capex: [],
    opex: [],
    rental: []
  });
  

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    
    setFile(selectedFile);
    
    // In a real implementation, we would use a library like xlsx to read the file
    // For now, we'll simulate the preview data
    
    // This would be replaced with actual Excel parsing code
    setTimeout(() => {
      setPreviewData({
        manpower: [
          { sr_no: 1, role_description: "Project Manager", mll_grade: "G5", category: "Management", roll: "Full-time", ctc: 1200000, nos: 1 },
          { sr_no: 2, role_description: "Team Lead", mll_grade: "G4", category: "Management", roll: "Full-time", ctc: 900000, nos: 2 },
          { sr_no: 3, role_description: "Developer", mll_grade: "G3", category: "Technical", roll: "Full-time", ctc: 700000, nos: 5 },
        ],
        capex: [
          { sr_no: 1, asset: "Laptop", asset_description: "Dell XPS", category: "IT Equipment", period: 36, amc: 10, unit_cost: 85000, nos: 8 },
          { sr_no: 2, asset: "Server", asset_description: "Dell PowerEdge", category: "IT Equipment", period: 60, amc: 15, unit_cost: 350000, nos: 1 },
        ],
        opex: [
          { sr_no: 1, cost_description: "Internet", category: "Utilities", unit_cost: 5000, nos: 1 },
          { sr_no: 2, cost_description: "Software Licenses", category: "IT", unit_cost: 15000, nos: 10 },
        ],
        rental: [
          { sr_no: 1, location: "Mumbai Office", area_sqft: 2000, rent_per_sqft: 120 },
        ]
      });
    }, 500);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // This would be replaced with actual API call to backend
      // Include the obfId in the form data or endpoint URL
      // Example: const formData = new FormData();
      //          formData.append('file', file);
      //          formData.append('obf_id', obfId || '');
      //          const response = await fetch('/api/upload?obf_id=' + obfId, { method: 'POST', body: formData });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success scenario
      setUploadStatus("success");
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setIsDialogOpen(false);
        setFile(null);
        setUploadStatus("idle");
        setPreviewData({
          manpower: [],
          capex: [],
          opex: [],
          rental: []
        });
      }, 2000);
      
    } catch (error) {
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const renderTablePreview = (data: any[], type: string) => {
    if (data.length === 0) return <p className="text-sm text-gray-500">No {type} data found in the uploaded file.</p>;
    
    const headers = Object.keys(data[0]);
    
    return (
      <div className="border rounded-md">
        <Table>
          <TableCaption>Preview of {type} data</TableCaption>
          <TableHeader>
            <TableRow>
              {headers.map(header => (
                <TableHead key={header}>{header.replace(/_/g, ' ').toUpperCase()}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {headers.map(header => (
                  <TableCell key={`${index}-${header}`}>{row[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Master Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upload Master Data</DialogTitle>
          <DialogDescription>
            Upload an Excel file containing master data for Manpower, CAPEX, OPEX, and Rental.
            Each type of data should be in a separate sheet with matching column names.
          </DialogDescription>
        </DialogHeader>
        
        {uploadStatus === "idle" ? (
          <>
            {!file ? (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <MicrosoftExcelLogo className="w-12 h-12 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Excel files only (.xlsx, .xls)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".xlsx,.xls" 
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <MicrosoftExcelLogo className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-auto"
                    onClick={() => {
                      setFile(null);
                      setPreviewData({
                        manpower: [],
                        capex: [],
                        opex: [],
                        rental: []
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <Tabs defaultValue="manpower">
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="manpower">Manpower</TabsTrigger>
                    <TabsTrigger value="capex">CAPEX</TabsTrigger>
                    <TabsTrigger value="opex">OPEX</TabsTrigger>
                    <TabsTrigger value="rental">Rental</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manpower" className="h-[300px] overflow-auto mt-4">
                    {renderTablePreview(previewData.manpower, "manpower")}
                  </TabsContent>
                  
                  <TabsContent value="capex" className="h-[300px] overflow-auto mt-4">
                    {renderTablePreview(previewData.capex, "capex")}
                  </TabsContent>
                  
                  <TabsContent value="opex" className="h-[300px] overflow-auto mt-4">
                    {renderTablePreview(previewData.opex, "opex")}
                  </TabsContent>
                  
                  <TabsContent value="rental" className="h-[300px] overflow-auto mt-4">
                    {renderTablePreview(previewData.rental, "rental")}
                  </TabsContent>
                </Tabs>
              </>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? "Uploading..." : "Upload and Process"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            {uploadStatus === "success" ? (
              <AlertDialog>
                <Check className="h-5 w-5 text-green-600" />
                <AlertDialogTitle>Upload Successful</AlertDialogTitle>
                <AlertDialogDescription>
                  All master data has been processed and saved to the database.
                </AlertDialogDescription>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <X className="h-5 w-5" />
                <AlertDialogTitle>Upload Failed</AlertDialogTitle>
                <AlertDialogDescription>
                  There was an error processing your file. Please ensure it follows the required format and try again.
                </AlertDialogDescription>
              </AlertDialog>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 