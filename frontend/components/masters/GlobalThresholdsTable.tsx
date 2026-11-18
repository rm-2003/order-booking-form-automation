"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PencilSimple, Trash, Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { mastersApi } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Define the Threshold type
interface Threshold {
  id: string;
  vertical: string;
  project_type: string;
  gross_margin_percent_min: number;
  credit_period_days: number;
  capex_min_lakhs: number;
  ebit_percent_min: number;
  ebt_percent_min: number;
}

// Master data options
const VERTICALS = [
  'Auto and Engineering (Non-MnM)', 'E-Commerce', 'Auto Outbound',
  'Transportation', 'Enterprise Mobility', 'S and LF / Stockyards',
  'AFS (MnM)', 'Auto and Engineering - Telecom', 'Distribution/EDSP/OXD/XL',
  'Transport Solutions Group', 'MFC', 'FMCG and Pharma', 'EV Deliveries',
  'Consumer - CD, CE, AFR and Bazaar', 'Field Sales - Auto and Engineering(Non-MnM)',
  'Field Sales - Consumer and Pharma', 'Field Sales - Telecom', 'LMD'
];

const allProjectTypes = [
  'Warehousing and VAS', 'Integrated Solutions', 'Transportation',
  'S and LF / Stockyards', 'Delivery as Service', 'Distribution/EDSP/OXD/XL',
  'MFC', 'EV Deliveries'
];

const nonLmdProjectTypes = [
  'Warehousing and VAS', 'Integrated Solutions', 'Transportation',
  'S and LF / Stockyards'
];

export default function GlobalThresholdsTable() {
  const [thresholdsData, setThresholdsData] = useState<Threshold[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentThreshold, setCurrentThreshold] = useState<Threshold | null>(null);
  const [formData, setFormData] = useState({
    vertical: "",
    project_type: "",
    gross_margin_percent_min: "",
    credit_period_days: "",
    capex_min_lakhs: "",
    ebit_percent_min: "",
    ebt_percent_min: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchThresholdsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mastersApi.thresholds.getAll();
        setThresholdsData(data);
      } catch (err) {
        console.error("Failed to fetch thresholds data:", err);
        setError(err instanceof Error ? err.message : "Failed to load thresholds data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchThresholdsData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    // If vertical is changed from LMD to non-LMD and current project type is not in nonLmdProjectTypes, reset it
    if (name === 'vertical' && value !== 'LMD' && !nonLmdProjectTypes.includes(formData.project_type)) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        project_type: nonLmdProjectTypes[0] // Set to first non-LMD project type
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      vertical: "",
      project_type: "",
      gross_margin_percent_min: "",
      credit_period_days: "",
      capex_min_lakhs: "",
      ebit_percent_min: "",
      ebt_percent_min: ""
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (threshold: Threshold) => {
    setCurrentThreshold(threshold);
    setFormData({
      vertical: threshold.vertical,
      project_type: threshold.project_type,
      gross_margin_percent_min: threshold.gross_margin_percent_min.toString(),
      credit_period_days: threshold.credit_period_days.toString(),
      capex_min_lakhs: threshold.capex_min_lakhs.toString(),
      ebit_percent_min: threshold.ebit_percent_min.toString(),
      ebt_percent_min: threshold.ebt_percent_min.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleAddSubmit = async () => {
    try {
      const payload = {
        ...formData,
        gross_margin_percent_min: parseFloat(formData.gross_margin_percent_min),
        credit_period_days: parseInt(formData.credit_period_days),
        capex_min_lakhs: parseFloat(formData.capex_min_lakhs),
        ebit_percent_min: parseFloat(formData.ebit_percent_min),
        ebt_percent_min: parseFloat(formData.ebt_percent_min)
      };
      
      const result = await mastersApi.thresholds.create(payload);
      
      setThresholdsData(prev => [...prev, result]);
      toast.success("Threshold entry added successfully");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Failed to add threshold entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to add threshold entry");
    }
  };

  const handleEditSubmit = async () => {
    if (!currentThreshold) return;
    
    try {
      const payload = {
        ...formData,
        gross_margin_percent_min: parseFloat(formData.gross_margin_percent_min),
        credit_period_days: parseInt(formData.credit_period_days),
        capex_min_lakhs: parseFloat(formData.capex_min_lakhs),
        ebit_percent_min: parseFloat(formData.ebit_percent_min),
        ebt_percent_min: parseFloat(formData.ebt_percent_min)
      };
      
      const result = await mastersApi.thresholds.update(currentThreshold.id, payload);
      
      setThresholdsData(prev => prev.map(item => 
        item.id === currentThreshold.id ? result : item
      ));
      
      toast.success("Threshold entry updated successfully");
      setIsEditDialogOpen(false);
      setCurrentThreshold(null);
      resetForm();
      return result;
    } catch (err) {
      console.error("Failed to update threshold entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update threshold entry");
      return null;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this threshold entry?")) {
      return;
    }
    
    try {
      await mastersApi.thresholds.delete(id);
      setThresholdsData(prev => prev.filter(item => item.id !== id));
      toast.success("Threshold entry deleted successfully");
    } catch (err) {
      console.error("Failed to delete threshold entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete threshold entry");
    }
  };

  // Filter thresholdsData based on search query
  const filteredThresholdsData = thresholdsData.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.vertical.toLowerCase().includes(q) ||
      item.project_type.toLowerCase().includes(q) ||
      String(item.gross_margin_percent_min).includes(q) ||
      String(item.credit_period_days).includes(q) ||
      String(item.capex_min_lakhs).includes(q) ||
      String(item.ebit_percent_min).includes(q) ||
      String(item.ebt_percent_min).includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Thresholds Data</h2>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="border rounded-md">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 relative">
          <MagnifyingGlass className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search Thresholds..."
            className="pl-8 py-6 shadow-none border border-gray-300 focus:border-[#d5233b] focus-visible:border-[#d5233b] rounded-md"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={openAddDialog} className="flex items-center bg-[#d5233b] hover:bg-[#d5233b] text-white gap-1">
          <Plus size={16} weight="bold" />
          Add Entry
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}
      
      <div className="border rounded-md h-96 overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f4f6f8]">
              <TableHead>Vertical</TableHead>
              <TableHead>Project Type</TableHead>
              <TableHead>Gross Margin % Min</TableHead>
              <TableHead>Credit Period Days</TableHead>
              <TableHead>Capex Min (Lakhs)</TableHead>
              <TableHead>EBIT % Min</TableHead>
              <TableHead>EBT % Min</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredThresholdsData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No thresholds data available. Click 'Add Entry' to create one.
                </TableCell>
              </TableRow>
            ) : (
              filteredThresholdsData.map((threshold) => (
                <TableRow key={threshold.id}>
                  <TableCell>{threshold.vertical}</TableCell>
                  <TableCell>{threshold.project_type}</TableCell>
                  <TableCell>{threshold.gross_margin_percent_min}%</TableCell>
                  <TableCell>{threshold.credit_period_days}</TableCell>
                  <TableCell>{threshold.capex_min_lakhs}</TableCell>
                  <TableCell>{threshold.ebit_percent_min}%</TableCell>
                  <TableCell>{threshold.ebt_percent_min}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(threshold)}
                      >
                        <PencilSimple className="h-4 w-4" weight="duotone" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(threshold.id)}
                      >
                        <Trash className="h-4 w-4 text-[#d5233b]" weight="duotone" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Threshold Entry</DialogTitle>
            <DialogDescription>
              Add a new threshold entry to the master data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vertical">Vertical*</Label>
              <Select
                value={formData.vertical}
                onValueChange={(value) => handleSelectChange(value, 'vertical')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vertical" />
                </SelectTrigger>
                <SelectContent>
                  {VERTICALS.map((vertical) => (
                    <SelectItem key={vertical} value={vertical}>
                      {vertical}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project_type">Project Type*</Label>
              <Select
                value={formData.project_type}
                onValueChange={(value) => handleSelectChange(value, 'project_type')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.vertical === 'LMD' ? allProjectTypes : nonLmdProjectTypes).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gross_margin_percent_min">Gross Margin % Min*</Label>
              <Input
                id="gross_margin_percent_min"
                name="gross_margin_percent_min"
                type="number"
                step="0.01"
                value={formData.gross_margin_percent_min}
                onChange={handleInputChange}
                placeholder="Enter minimum gross margin percentage"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credit_period_days">Credit Period Days*</Label>
              <Input
                id="credit_period_days"
                name="credit_period_days"
                type="number"
                value={formData.credit_period_days}
                onChange={handleInputChange}
                placeholder="Enter credit period in days"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capex_min_lakhs">Capex Min (Lakhs)*</Label>
              <Input
                id="capex_min_lakhs"
                name="capex_min_lakhs"
                type="number"
                step="0.01"
                value={formData.capex_min_lakhs}
                onChange={handleInputChange}
                placeholder="Enter minimum capex in lakhs"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ebit_percent_min">EBIT % Min*</Label>
              <Input
                id="ebit_percent_min"
                name="ebit_percent_min"
                type="number"
                step="0.01"
                value={formData.ebit_percent_min}
                onChange={handleInputChange}
                placeholder="Enter minimum EBIT percentage"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ebt_percent_min">EBT % Min*</Label>
              <Input
                id="ebt_percent_min"
                name="ebt_percent_min"
                type="number"
                step="0.01"
                value={formData.ebt_percent_min}
                onChange={handleInputChange}
                placeholder="Enter minimum EBT percentage"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSubmit}
              disabled={!formData.vertical || !formData.project_type}
            >
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Threshold Entry</DialogTitle>
            <DialogDescription>
              Update the threshold entry details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vertical">Vertical*</Label>
              <Select
                value={formData.vertical}
                onValueChange={(value) => handleSelectChange(value, 'vertical')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vertical" />
                </SelectTrigger>
                <SelectContent>
                  {VERTICALS.map((vertical) => (
                    <SelectItem key={vertical} value={vertical}>
                      {vertical}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project_type">Project Type*</Label>
              <Select
                value={formData.project_type}
                onValueChange={(value) => handleSelectChange(value, 'project_type')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.vertical === 'LMD' ? allProjectTypes : nonLmdProjectTypes).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gross_margin_percent_min">Gross Margin % Min*</Label>
              <Input
                id="gross_margin_percent_min"
                name="gross_margin_percent_min"
                type="number"
                step="0.01"
                value={formData.gross_margin_percent_min}
                onChange={handleInputChange}
                placeholder="Enter minimum gross margin percentage"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credit_period_days">Credit Period Days*</Label>
              <Input
                id="credit_period_days"
                name="credit_period_days"
                type="number"
                value={formData.credit_period_days}
                onChange={handleInputChange}
                placeholder="Enter credit period in days"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capex_min_lakhs">Capex Min (Lakhs)*</Label>
              <Input
                id="capex_min_lakhs"
                name="capex_min_lakhs"
                type="number"
                step="0.01"
                value={formData.capex_min_lakhs}
                onChange={handleInputChange}
                placeholder="Enter minimum capex in lakhs"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ebit_percent_min">EBIT % Min*</Label>
              <Input
                id="ebit_percent_min"
                name="ebit_percent_min"
                type="number"
                step="0.01"
                value={formData.ebit_percent_min}
                onChange={handleInputChange}
                placeholder="Enter minimum EBIT percentage"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ebt_percent_min">EBT % Min*</Label>
              <Input
                id="ebt_percent_min"
                name="ebt_percent_min"
                type="number"
                step="0.01"
                value={formData.ebt_percent_min}
                onChange={handleInputChange}
                placeholder="Enter minimum EBT percentage"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit}
              disabled={!formData.vertical || !formData.project_type}
            >
              Update Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 