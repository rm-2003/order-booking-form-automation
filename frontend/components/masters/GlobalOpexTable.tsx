"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PencilSimple, Trash, Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mastersApi } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type Opex = {
  id: string;
  sr_no: number;
  cost_description: string;
  category: string;
  unit_cost: number;
  nos: number;
};

// Default opex descriptions
const DEFAULT_OPEX_DESCRIPTIONS = [
  "Electricity",
  "Electricity \"Air Con Area\"",
  "Water",
  "Repair / Maintenance cost",
  "Cleaning",
  "Pest control",
  "Staff Welfare",
  "Meal - Mgmt/Sup.",
  "Meal - Labour",
  "Conveyance - Mgmt/Sup.",
  "Conveyance - Labour",
  "Uniform+Safety shoes",
  "HR/Admin Cost",
  "Training Cost",
  "Labour License",
  "Medical Check-up",
  "Rewards & Recognition",
  "Telephones",
  "Mobile Phones",
  "Broadbands",
  "Leased line - Primary",
  "Leased line - Secondary",
  "Data card for Laptop",
  "Office stationery",
  "Printer ribbons and cartridges",
  "Other Office Expenses",
  "Warehouse Registers",
  "Asset Insurance cost",
  "Asset Maintenance Cost"
];

const CATEGORIES = [
  "Utility", 
  "Maintenance", 
  "HR", 
  "Communication", 
  "Office Admin", 
  "Insurance"
];

export default function GlobalOpexTable() {
  const [opexData, setOpexData] = useState<Opex[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentOpex, setCurrentOpex] = useState<Opex | null>(null);
  const [formData, setFormData] = useState({
    cost_description: "",
    category: "",
    unit_cost: "",
    nos: "1"
  });
  const [error, setError] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOpexData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call the getAll method for global master data
        const data = await mastersApi.opex.getAll();
        
        // Add sr_no to each item if not present and sort
        const dataWithSrNo = data.map((item: any, index: number) => ({
          ...item,
          sr_no: item.sr_no || index + 1
        }));
        
        dataWithSrNo.sort((a: Opex, b: Opex) => a.sr_no - b.sr_no);
        
        setOpexData(dataWithSrNo);
      } catch (err) {
        console.error("Failed to fetch OPEX data:", err);
        setError(err instanceof Error ? err.message : "Failed to load OPEX data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOpexData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name === "cost_description" && value === "add_new") {
      setIsAddingNew(true);
      setFormData(prev => ({
        ...prev,
        cost_description: ""
      }));
    } else {
      if (name === "cost_description") {
        setIsAddingNew(false);
      }
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNewDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewDescription(value);
    setFormData(prev => ({
      ...prev,
      cost_description: value
    }));
  };

  const resetForm = () => {
    setFormData({
      cost_description: "",
      category: "",
      unit_cost: "",
      nos: "1"
    });
    setNewDescription("");
    setIsAddingNew(false);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (opex: Opex) => {
    setCurrentOpex(opex);
    setFormData({
      cost_description: opex.cost_description,
      category: opex.category || "",
      unit_cost: opex.unit_cost?.toString() || "",
      nos: opex.nos?.toString() || "1"
    });
    setIsEditDialogOpen(true);
  };

  const handleAddSubmit = async () => {
    try {
      // Validate form
      if (!formData.cost_description.trim()) {
        setError("Cost description is required.");
        return;
      }
      
      // Calculate next sr_no
      const nextSrNo = opexData.length > 0 
        ? Math.max(...opexData.map(item => item.sr_no)) + 1 
        : 1;
      
      // Prepare data for API
      const payload = {
        sr_no: nextSrNo,
        cost_description: formData.cost_description,
        category: formData.category || "",
        unit_cost: parseFloat(formData.unit_cost) || 0,
        nos: parseInt(formData.nos) || 1
      };
      
      const result = await mastersApi.opex.create(payload);
      
      // Update local state
      setOpexData(prev => [...prev, {
        id: result.id,
        sr_no: nextSrNo,
        cost_description: formData.cost_description,
        category: formData.category || "",
        unit_cost: parseFloat(formData.unit_cost) || 0,
        nos: parseInt(formData.nos) || 1
      }]);
      
      toast.success("OPEX entry added successfully");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Failed to add OPEX entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to add OPEX entry");
    }
  };

  const handleEditSubmit = async () => {
    if (!currentOpex) return;
    
    try {
      // Validate form
      if (!formData.cost_description.trim()) {
        setError("Cost description is required.");
        return;
      }
      
      // Prepare data for API
      const payload = {
        sr_no: currentOpex.sr_no,
        cost_description: formData.cost_description,
        category: formData.category || "",
        unit_cost: parseFloat(formData.unit_cost) || 0,
        nos: parseInt(formData.nos) || 1
      };
      
      await mastersApi.opex.update(currentOpex.id, payload);
      
      // Update local state
      setOpexData(prev => prev.map(item => 
        item.id === currentOpex.id 
          ? {
              ...item,
              cost_description: formData.cost_description,
              category: formData.category || "",
              unit_cost: parseFloat(formData.unit_cost) || 0,
              nos: parseInt(formData.nos) || 1
            }
          : item
      ));
      
      toast.success("OPEX entry updated successfully");
      setIsEditDialogOpen(false);
      setCurrentOpex(null);
      resetForm();
    } catch (err) {
      console.error("Failed to update OPEX entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update OPEX entry");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this OPEX entry?")) {
      return;
    }
    
    try {
      await mastersApi.opex.delete(id);
      
      // Update local state
      setOpexData(prev => prev.filter(item => item.id !== id));
      
      toast.success("OPEX entry deleted successfully");
    } catch (err) {
      console.error("Failed to delete OPEX entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete OPEX entry");
    }
  };

  // Filter opexData based on search query
  const filteredOpexData = opexData.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.cost_description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      String(item.sr_no).includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">OPEX Data</h2>
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
        {/* <h2 className="text-lg font-medium">OPEX Master Data</h2> */}
        <div className="flex items-center gap-2 relative">
          <MagnifyingGlass className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search OPEX..."
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
              <TableHead>Sr. No</TableHead>
              <TableHead>Cost Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Unit Cost (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOpexData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No OPEX data available. Click 'Add Entry' to create one.
                </TableCell>
              </TableRow>
            ) : (
              filteredOpexData.map((opex) => (
                <TableRow key={opex.id}>
                  <TableCell>{opex.sr_no}</TableCell>
                  <TableCell>{opex.cost_description}</TableCell>
                  <TableCell>{opex.category || '-'}</TableCell>
                  <TableCell>{opex.unit_cost.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(opex)}
                      >
                        <PencilSimple className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(opex.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add OPEX Entry</DialogTitle>
            <DialogDescription>
              Add a new OPEX entry to the master data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cost_description">Cost Description*</Label>
              <Input
                id="cost_description"
                name="cost_description"
                value={formData.cost_description}
                onChange={handleInputChange}
                placeholder="Enter cost description"
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
            
            <div className="space-y-2">
              <Label htmlFor="nos">Number of Units</Label>
              <Input
                id="nos"
                name="nos"
                type="number"
                value={formData.nos}
                onChange={handleInputChange}
                placeholder="Enter number of units"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSubmit}
              disabled={!formData.cost_description}
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
            <DialogTitle>Edit OPEX Entry</DialogTitle>
            <DialogDescription>
              Update the OPEX entry details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cost_description">Cost Description*</Label>
              <Input
                id="cost_description"
                name="cost_description"
                value={formData.cost_description}
                onChange={handleInputChange}
                placeholder="Enter cost description"
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
            
            <div className="space-y-2">
              <Label htmlFor="nos">Number of Units</Label>
              <Input
                id="nos"
                name="nos"
                type="number"
                value={formData.nos}
                onChange={handleInputChange}
                placeholder="Enter number of units"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit}
              disabled={!formData.cost_description}
            >
              Update Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 