import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PencilSimple, Trash, Plus } from "@phosphor-icons/react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

type OpexTableProps = {
  obfId?: string;
};

type Opex = {
  id: string;
  obf_id: string;
  sl_no: number;
  cost_description: string;
  unit_cost: number;
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

export default function OpexTable({ obfId = "obf1" }: OpexTableProps) {
  const [opexData, setOpexData] = useState<Opex[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentOpex, setCurrentOpex] = useState<Opex | null>(null);
  const [formData, setFormData] = useState({
    cost_description: "",
    unit_cost_per_month: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    const fetchOpexData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mastersApi.opex.getByObf(obfId);
        
        // Add sl_no to each item if not present
        const dataWithSlNo = data.map((item: any, index: number) => ({
          ...item,
          sl_no: item.sl_no || index + 1
        }));
        
        setOpexData(dataWithSlNo);
      } catch (err) {
        console.error("Failed to fetch opex data:", err);
        setError(err instanceof Error ? err.message : "Failed to load opex data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOpexData();
  }, [obfId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    if (value === "add_new") {
      setIsAddingNew(true);
      setFormData(prev => ({
        ...prev,
        cost_description: ""
      }));
    } else {
      setIsAddingNew(false);
      setFormData(prev => ({
        ...prev,
        cost_description: value
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

  const handleAddSubmit = async () => {
    try {
      setError(null);
      
      // Validate form
      if (!formData.cost_description.trim()) {
        setError("Cost description is required.");
        return;
      }
      
      // Create opex entry data
      const opexEntry = {
        obf_id: obfId,
        sr_no: opexData.length + 1,
        cost_description: formData.cost_description,
        unit_cost: formData.unit_cost_per_month ? parseFloat(formData.unit_cost_per_month) : 0
      };
      
      // Send to API
      const newOpex = await mastersApi.opex.create(opexEntry);
      
      // Add to local state with sl_no
      setOpexData(prev => [
        ...prev, 
        {
          ...newOpex,
          sl_no: prev.length + 1
        }
      ]);
      
      // Reset form and close dialog
      setFormData({
        cost_description: "",
        unit_cost_per_month: ""
      });
      setIsAddDialogOpen(false);
      setIsAddingNew(false);
      setNewDescription("");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to add opex entry");
    }
  };

  const handleEditClick = (opex: Opex) => {
    setCurrentOpex(opex);
    setFormData({
      cost_description: opex.cost_description,
      unit_cost_per_month: String(opex.unit_cost)
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!currentOpex) return;
    
    try {
      setError(null);
      
      // Validate form
      if (!formData.cost_description.trim()) {
        setError("Cost description is required.");
        return;
      }
      
      // Update opex entry data
      const opexEntry = {
        obf_id: obfId,
        sr_no: currentOpex.sl_no,
        cost_description: formData.cost_description,
        unit_cost: formData.unit_cost_per_month ? parseFloat(formData.unit_cost_per_month) : 0
      };
      
      // Send to API
      await mastersApi.opex.update(currentOpex.id, opexEntry);
      
      // Update local state
      setOpexData(prev => 
        prev.map(item => item.id === currentOpex.id ? {
          ...item,
          ...opexEntry
        } : item)
      );
      
      // Reset form and close dialog
      setCurrentOpex(null);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update opex entry");
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this opex entry?")) {
      try {
        setError(null);
        
        // Send to API
        await mastersApi.opex.delete(id);
        
        // Update local state
        const updatedData = opexData.filter(item => item.id !== id);
        
        // Renumber the entries
        const renumberedData = updatedData.map((item, index) => ({
          ...item,
          sl_no: index + 1
        }));
        
        setOpexData(renumberedData);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to delete opex entry");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading opex data...</div>;
  }

  if (error) {
    return <div className="flex justify-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Opex
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Opex Entry</DialogTitle>
              <DialogDescription>
                Add a new opex entry to the master data.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cost_description">Cost Description*</Label>
                {!isAddingNew ? (
                  <Select 
                    onValueChange={handleSelectChange}
                    value={formData.cost_description}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cost description" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add_new" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add new description
                      </SelectItem>
                      {DEFAULT_OPEX_DESCRIPTIONS.map((description) => (
                        <SelectItem key={description} value={description}>
                          {description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-2">
                    <Input
                      id="new_description"
                      value={newDescription}
                      onChange={handleNewDescriptionChange}
                      placeholder="Enter new cost description"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsAddingNew(false);
                        setNewDescription("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit_cost_per_month">Unit Cost/Month (₹)</Label>
                <Input
                  id="unit_cost_per_month"
                  name="unit_cost_per_month"
                  type="number"
                  step="0.01"
                  value={formData.unit_cost_per_month}
                  onChange={handleInputChange}
                  placeholder="e.g. 5000"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubmit}>
                Add Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>List of opex entries in the master data.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Sl. No.</TableHead>
              <TableHead>Cost Description</TableHead>
              <TableHead>Unit Cost/Month (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opexData.map((opex) => (
              <TableRow key={opex.id}>
                <TableCell>{opex.sl_no}</TableCell>
                <TableCell>{opex.cost_description}</TableCell>
                <TableCell>
                  {opex.unit_cost === 0 ? "-" : opex.unit_cost.toLocaleString('en-IN')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(opex)}>
                      <PencilSimple className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(opex.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Opex Entry</DialogTitle>
            <DialogDescription>
              Update the details of this opex entry.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_cost_description">Cost Description*</Label>
              <Select 
                onValueChange={handleSelectChange}
                value={formData.cost_description}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cost description" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add_new" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add new description
                  </SelectItem>
                  {DEFAULT_OPEX_DESCRIPTIONS.map((description) => (
                    <SelectItem key={description} value={description}>
                      {description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_unit_cost_per_month">Unit Cost/Month (₹)</Label>
              <Input
                id="edit_unit_cost_per_month"
                name="unit_cost_per_month"
                type="number"
                step="0.01"
                value={formData.unit_cost_per_month}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              Update Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 