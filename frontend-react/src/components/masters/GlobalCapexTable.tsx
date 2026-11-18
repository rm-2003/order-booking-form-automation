"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { PencilSimple, Trash, Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { mastersApi } from "../../lib/api";
import { toast } from "sonner";
import { Skeleton } from "../../components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

type Capex = {
  id: string;
  sr_no: number;
  asset: string;
  asset_description: string;
  category: string;
  period: number;
  amc: number; // Stored as decimal (e.g., 0.05 for 5%)
  unit_cost: number;
};

// Master data options
const ASSET_TYPES = [
  "DG", "Printer", "Fan", "AC", "Air curtain", "Aircon", "Trolley", "Water cooler", 
  "Forklift", "Attendance System", "Others", "CCTV", "Cartoon Box", "Cabling", 
  "Computer", "Reach Truck", "Battery", "Fire Alarm", "Fire Extinguisher", 
  "Cleanin Machine", "Flooring", "Ladder", "Inverter", "Telephone", "Locker", 
  "Power Pallet Truck", "Shelving", "Metal detector", "Office set-up", 
  "Order Picker", "Table", "Pallet", "Plastic Bins", "HHD", "Bins", "Television", 
  "Signage", "Smoke Detector", "Cupboard", "Strapping Machine", "Wrapping Machine", 
  "Tow Truck", "UPS", "W/h Enclosure", "Weighting Scale", "Board"
];

const CATEGORIES = [
  "Utility", "IT", "HSSE", "MHE", "Facility", "WH Equip", "Packing", "L/UL Equip", 
  "Storage", "Other Equip"
];

// Asset description options - shortened for brevity
const ASSET_DESCRIPTIONS = [
  "10 KVA 1 Phase With AMF Panel (Without Installation)",
  "10 KVA 1 Phase With MCP (Without Installation)",
  "10 KVA 3 Phase With AMF Panel (Without Installation)",
  "10 KVA 3 Phase With MCP (Without Installation)",
  "100 KVA 3 Phase With AMF Panel (Without Installation)",
  "Air Conditioner - Split 1 Ton",
  "Air Conditioner - Split 2 Ton",
  "CCTV Unit set - with DVR and 16 Camera",
  "Diesel Forklift (Godrej) - Reach Height 4.5 mtr / Cap 3.0 Ton",
  "Electrification - Standard",
  "Fire Extinguisher - ABC type - 4 kg",
  "Laptop",
  "Office Furniture Set",
  "UPS - 2 KVA"
];

export default function GlobalCapexTable() {
  const [capexData, setCapexData] = useState<Capex[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCapex, setCurrentCapex] = useState<Capex | null>(null);
  const [formData, setFormData] = useState({
    asset: "",
    asset_description: "",
    category: "",
    period: "",
    amc: "",
    unit_cost: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isAssetDescriptionOpen, setIsAssetDescriptionOpen] = useState(false);
  const [newAssetDescription, setNewAssetDescription] = useState("");
  const [isAddingNewDescription, setIsAddingNewDescription] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Capex | null>(null);

  const fetchCapex = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await mastersApi.capex.getAll();
      
      // Add sr_no to each item if not present and sort by sr_no
      const dataWithSrNo = data.map((item: any, index: number) => ({
        ...item,
        sr_no: item.sr_no || index + 1
      }));
      
      dataWithSrNo.sort((a: Capex, b: Capex) => a.sr_no - b.sr_no);
      
      setCapexData(dataWithSrNo);
    } catch (err) {
      console.error("Failed to fetch CAPEX data:", err);
      setError(err instanceof Error ? err.message : "Failed to load CAPEX data");
      toast.error("Failed to fetch capex data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapex();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name === "asset_description" && value === "add_new") {
      setIsAddingNewDescription(true);
      setFormData(prev => ({
        ...prev,
        asset_description: ""
      }));
    } else {
      if (name === "asset_description") {
        setIsAddingNewDescription(false);
      }
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNewDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewAssetDescription(value);
    setFormData(prev => ({
      ...prev,
      asset_description: value
    }));
  };

  const resetForm = () => {
    setFormData({
      asset: "",
      asset_description: "",
      category: "",
      period: "",
      amc: "",
      unit_cost: ""
    });
    setNewAssetDescription("");
    setIsAddingNewDescription(false);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (capex: Capex) => {
    setCurrentCapex(capex);
    setFormData({
      asset: capex.asset,
      asset_description: capex.asset_description || "",
      category: capex.category || "",
      period: capex.period?.toString() || "",
      amc: (capex.amc * 100).toString(),
      unit_cost: capex.unit_cost?.toString() || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleAddSubmit = async () => {
    try {
      // Calculate next sr_no
      const nextSrNo = capexData.length > 0 
        ? Math.max(...capexData.map(item => item.sr_no)) + 1 
        : 1;
      
      // Calculate AMC as a decimal (convert from percentage)
      const amcDecimal = parseFloat(formData.amc) / 100;
      
      // Prepare data for API
      const payload = {
        sr_no: nextSrNo,
        asset: formData.asset,
        asset_description: formData.asset_description || "",
        category: formData.category || "",
        period: parseInt(formData.period) || 0,
        amc: amcDecimal,
        unit_cost: parseFloat(formData.unit_cost) || 0
      };
      
      const result = await mastersApi.capex.create(payload);
      
      // Update local state
      setCapexData(prev => [...prev, {
        id: result.id,
        sr_no: nextSrNo,
        asset: formData.asset,
        asset_description: formData.asset_description || "",
        category: formData.category || "",
        period: parseInt(formData.period) || 0,
        amc: amcDecimal,
        unit_cost: parseFloat(formData.unit_cost) || 0
      }]);
      
      toast.success("CAPEX entry added successfully");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Failed to add CAPEX entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to add CAPEX entry");
    }
  };

  const handleEditSubmit = async () => {
    if (!currentCapex) return;
    
    try {
      // Calculate AMC as a decimal (convert from percentage)
      const amcDecimal = parseFloat(formData.amc) / 100;
      
      // Prepare data for API
      const payload = {
        sr_no: currentCapex.sr_no,
        asset: formData.asset,
        asset_description: formData.asset_description || "",
        category: formData.category || "",
        period: parseInt(formData.period) || 0,
        amc: amcDecimal,
        unit_cost: parseFloat(formData.unit_cost) || 0
      };
      
      await mastersApi.capex.update(currentCapex.id, payload);
      
      // Update local state
      setCapexData(prev => prev.map(item => 
        item.id === currentCapex.id 
          ? {
              ...item,
              asset: formData.asset,
              asset_description: formData.asset_description || "",
              category: formData.category || "",
              period: parseInt(formData.period) || 0,
              amc: amcDecimal,
              unit_cost: parseFloat(formData.unit_cost) || 0
            }
          : item
      ));
      
      toast.success("CAPEX entry updated successfully");
      setIsEditDialogOpen(false);
      setCurrentCapex(null);
      resetForm();
    } catch (err) {
      console.error("Failed to update CAPEX entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update CAPEX entry");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await mastersApi.capex.delete(id);
      toast.success("Capex deleted successfully");
      fetchCapex();
    } catch (error) {
      console.error("Error deleting capex:", error);
      toast.error("Failed to delete capex");
    }
  };

  const formatAmcPercentage = (amc: number): string => {
    return `${(amc * 100).toFixed(2)}%`;
  };

  // Filter capexData based on search query
  const filteredCapexData = capexData.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.asset.toLowerCase().includes(q) ||
      item.asset_description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      String(item.sr_no).includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">CAPEX Data</h2>
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
        {/* <h2 className="text-lg font-medium">CAPEX Master Data</h2> */}
        <div className="flex items-center gap-2 relative">
          <MagnifyingGlass className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search CAPEX..."
            className="pl-8 py-6 shadow-none border border-gray-300 focus:border-[#d5233b] focus-visible:border-[#d5233b] rounded-md"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
              <TableHead>Sr. No</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Period (yrs)</TableHead>
              <TableHead>AMC</TableHead>
              <TableHead>Unit Cost (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCapexData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No CAPEX data available. Click 'Add Entry' to create one.
                </TableCell>
              </TableRow>
            ) : (
              filteredCapexData.map((capex) => (
                <TableRow key={capex.id}>
                  <TableCell>{capex.sr_no}</TableCell>
                  <TableCell>{capex.asset}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={capex.asset_description}>
                    {capex.asset_description || '-'}
                  </TableCell>
                  <TableCell>{capex.category || '-'}</TableCell>
                  <TableCell>{capex.period || '-'}</TableCell>
                  <TableCell>{formatAmcPercentage(capex.amc)}</TableCell>
                  <TableCell>{capex.unit_cost.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(capex)}
                      >
                        <PencilSimple className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setItemToDelete(capex);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add CAPEX Entry</DialogTitle>
            <DialogDescription>
              Add a new CAPEX entry to the master data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset Type*</Label>
              <Input
                id="asset"
                name="asset"
                value={formData.asset}
                onChange={handleInputChange}
                placeholder="Enter asset type"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Enter category"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="asset_description">Asset Description</Label>
              <Input
                id="asset_description"
                name="asset_description"
                value={formData.asset_description}
                onChange={handleInputChange}
                placeholder="Enter asset description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Period (years)</Label>
              <Input
                id="period"
                name="period"
                type="number"
                value={formData.period}
                onChange={handleInputChange}
                placeholder="Enter period in years"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amc">AMC (%)</Label>
              <Input
                id="amc"
                name="amc"
                type="number"
                value={formData.amc}
                onChange={handleInputChange}
                placeholder="Enter AMC percentage"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit_cost">Unit Cost (₹)</Label>
              <Input
                id="unit_cost"
                name="unit_cost"
                type="number"
                value={formData.unit_cost}
                onChange={handleInputChange}
                placeholder="Enter unit cost"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSubmit}
              disabled={!formData.asset}
            >
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit CAPEX Entry</DialogTitle>
            <DialogDescription>
              Update the CAPEX entry details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset Type*</Label>
              <Input
                id="asset"
                name="asset"
                value={formData.asset}
                onChange={handleInputChange}
                placeholder="Enter asset type"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Enter category"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="asset_description">Asset Description</Label>
              <Input
                id="asset_description"
                name="asset_description"
                value={formData.asset_description}
                onChange={handleInputChange}
                placeholder="Enter asset description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Period (years)</Label>
              <Input
                id="period"
                name="period"
                type="number"
                value={formData.period}
                onChange={handleInputChange}
                placeholder="Enter period in years"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amc">AMC (%)</Label>
              <Input
                id="amc"
                name="amc"
                type="number"
                value={formData.amc}
                onChange={handleInputChange}
                placeholder="Enter AMC percentage"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit_cost">Unit Cost (₹)</Label>
              <Input
                id="unit_cost"
                name="unit_cost"
                type="number"
                value={formData.unit_cost}
                onChange={handleInputChange}
                placeholder="Enter unit cost"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit}
              disabled={!formData.asset}
            >
              Update Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the capex entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete) {
                  handleDelete(itemToDelete.id);
                  setDeleteDialogOpen(false);
                  setItemToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 