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

// Define the Manpower type
interface Manpower {
  id: string;
  sr_no: number;
  role_description: string;
  mll_grade?: string;
  category?: string;
  roll?: string;
  ctc: number;
}

// Master data options
const ROLE_DESCRIPTIONS = [
  "Adhoc Delivery Associates", "Adhoc Enroute Loaders", "Adhoc Loaders", "Adhoc Process Associates",
  "Adhoc Security Guard", "ADM", "Admin Staff (DPO/MIS)", "Admin Staff (skilled)Warehouse",
  "Aerosol Checkers", "AFL Operator", "Area Manager", "Assistant Manager",
  "Assistant/Deputy Manager", "Associate", "Associate - Operations", "Associates( semi-skilled )",
  "Asst. Manager", "BA - Executive", "BA - Helper", "BA Manpower",
  "BA Supervisor", "BA Supervisor( Shared resource)", "BA-MHE Operator", "BA-Operator",
  "BA-Picker", "BOPT Operator", "Cashier", "Casual Labour (Semi-skilled)",
  "Casual Manpower for cleaning", "CAT manpower", "CCTV Operator", "CCTV Operator/ MST",
  "Checker & Put away Labour (Skilled)", "Checkers", "CL (Un-Skilled)", "Cleaner",
  "Clerk", "Combi lift", "Commercial Executive", "Computer operators",
  "Control Tower Executive", "Crane operator", "Cross Dock In-charge", "Cross Dock Manpower",
  "CSD + Water Planner", "Cycle count Casual", "Damage Handling-Support", "Data Entry Operator (DEO)",
  "DC manager", "Delivery Associate", "DEO + (MIS + Documentation)", "DEO Co-Packaging",
  "DEO Cum Supervisor", "DEO/Executive", "DEO/Executive (PCS / GR preparation)", 
  "DEO/Executive (Receipt to Dispatch System Operator )", "DEO/Supervisor", "Deputy Manager",
  "Dock Checker", "Dock Checker in", "Dock Checker out", "Dock Marshal",
  "Dock Security", "Dock-Checker-out", "Documentation", "Driver",
  "Dy Manager (ADM)", "Dy. Manager", "Dy. Manager - HR & Admin", "Electricians",
  "Enroute Loaders", "EOT Operator", "EV Driver", "Excavator Floor in-charge",
  "Executive - Admin", "Executive - EV Operations", "Executive - HR & Admin", "Executive - HR / MIS",
  "Executive - Operation", "Executive - Operations", "Executive - Vehicle Placement", "Executive (Operation Supervisor)",
  "Executive (Safety- Supervisor)", "Executive- Functional in-charge", "Executive Inventory",
];

const MLL_GRADES = [
  "Assistant Manager", "DEO", "Deputy Manager", "Deputy Manager - 1",
  "Deputy Manager - 2", "Deputy Manager - 3", "Executive", "Executive - 1",
  "Executive - 2", "Executive - 3", "Executive-1", "Interns",
  "Labour", "Manager", "Manager - 1", "Manager - 2",
  "Manager - 3", "MHE Operator", "MLL Grade", "Security Guard",
  "Security Supervisor", "Semi-Skilled Labour", "Semiskilled-Operators", "Senior Executive",
  "Senior Executive - 1", "Senior Executive - 2", "Senior Executive - 3", "Senior Manager",
  "Senior Manager - 1", "Skilled Labour", "Skilled Operators", "Staff",
  "Supervisor", "Supervisor - 1", "Supervisor - 2", "Supervisor - 3",
  "Supervisory", "Team Leader", "Un Skilled Labour", "Unskilled",
  "L2DH-AVP", "L3DH-Sr.GM", "L4DH-General Manager", "L5DH-DGM",
  "L5M-AGM", "L6M-Senior Manager", "L7M-Manager", "L7O-Deputy Manager",
  "L8O-Asst. Manager", "L9O-Sr.Executive", "L10O-Executive"
];

const CATEGORIES = [
  "Management", "Supervisory", "Labour", "Security"
];

const ROLLS = [
  "MLL", "Contract"
];

export default function GlobalManpowerTable() {
  const [manpowerData, setManpowerData] = useState<Manpower[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentManpower, setCurrentManpower] = useState<Manpower | null>(null);
  const [formData, setFormData] = useState({
    role_description: "",
    mll_grade: "",
    category: "",
    roll: "",
    ctc: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchManpowerData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mastersApi.manpower.getAll();
        
        // Add sr_no to each item if not present and sort by sr_no
        const dataWithSrNo = data.map((item: any, index: number) => ({
          ...item,
          sr_no: item.sr_no || index + 1
        }));
        
        dataWithSrNo.sort((a: Manpower, b: Manpower) => a.sr_no - b.sr_no);
        
        setManpowerData(dataWithSrNo);
      } catch (err) {
        console.error("Failed to fetch manpower data:", err);
        setError(err instanceof Error ? err.message : "Failed to load manpower data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchManpowerData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      role_description: "",
      mll_grade: "",
      category: "",
      roll: "",
      ctc: ""
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (manpower: Manpower) => {
    setCurrentManpower(manpower);
    setFormData({
      role_description: manpower.role_description,
      mll_grade: manpower.mll_grade || "",
      category: manpower.category || "",
      roll: manpower.roll || "",
      ctc: manpower.ctc?.toString() || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleAddSubmit = async () => {
    try {
      // Calculate next sr_no
      const nextSrNo = manpowerData.length > 0 
        ? Math.max(...manpowerData.map(item => item.sr_no)) + 1 
        : 1;
      
      // Prepare data for API
      const payload = {
        ...formData,
        sr_no: nextSrNo,
        ctc: parseFloat(formData.ctc) || 0,
        mll_grade: formData.mll_grade || "",
        category: formData.category || "",
        roll: formData.roll || ""
      };
      
      const result = await mastersApi.manpower.create(payload);
      
      // Update local state
      setManpowerData(prev => [...prev, {
        id: result.id,
        sr_no: nextSrNo,
        role_description: formData.role_description,
        mll_grade: formData.mll_grade || "",
        category: formData.category || "",
        roll: formData.roll || "",
        ctc: parseFloat(formData.ctc) || 0
      }]);
      
      toast.success("Manpower entry added successfully");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Failed to add manpower entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to add manpower entry");
    }
  };

  const handleEditSubmit = async () => {
    if (!currentManpower) return;
    
    try {
      // Prepare data for API
      const payload = {
        ...formData,
        sr_no: currentManpower.sr_no,
        ctc: parseFloat(formData.ctc) || 0,
        mll_grade: formData.mll_grade || "",
        category: formData.category || "",
        roll: formData.roll || ""
      };
      
      await mastersApi.manpower.update(currentManpower.id, payload);
      
      // Update local state
      setManpowerData(prev => prev.map(item => 
        item.id === currentManpower.id 
          ? {
              ...item,
              role_description: formData.role_description,
              mll_grade: formData.mll_grade || "",
              category: formData.category || "",
              roll: formData.roll || "",
              ctc: parseFloat(formData.ctc) || 0
            }
          : item
      ));
      
      toast.success("Manpower entry updated successfully");
      setIsEditDialogOpen(false);
      setCurrentManpower(null);
      resetForm();
    } catch (err) {
      console.error("Failed to update manpower entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update manpower entry");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this manpower entry?")) {
      return;
    }
    
    try {
      await mastersApi.manpower.delete(id);
      
      // Update local state
      setManpowerData(prev => prev.filter(item => item.id !== id));
      
      toast.success("Manpower entry deleted successfully");
    } catch (err) {
      console.error("Failed to delete manpower entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete manpower entry");
    }
  };

  // Filter manpowerData based on search query
  const filteredManpowerData = manpowerData.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.role_description.toLowerCase().includes(q) ||
      (item.mll_grade || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q) ||
      (item.roll || '').toLowerCase().includes(q) ||
      String(item.ctc).includes(q) ||
      String(item.sr_no).includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Manpower Data</h2>
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
        {/* <h2 className="text-lg font-medium">Manpower Data</h2> */}
        <div className="flex items-center gap-2 relative">
          <MagnifyingGlass className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search Manpower..."
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
              <TableHead>Role Description</TableHead>
              <TableHead>MLL Grade</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Roll</TableHead>
              <TableHead>CTC</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredManpowerData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No manpower data available. Click 'Add Entry' to create one.
                </TableCell>
              </TableRow>
            ) : (
              filteredManpowerData.map((manpower) => (
                <TableRow key={manpower.id}>
                  <TableCell>{manpower.sr_no}</TableCell>
                  <TableCell>{manpower.role_description}</TableCell>
                  <TableCell>{manpower.mll_grade || '-'}</TableCell>
                  <TableCell>{manpower.category || '-'}</TableCell>
                  <TableCell>{manpower.roll || '-'}</TableCell>
                  <TableCell>{manpower.ctc}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(manpower)}
                      >
                        <PencilSimple className="h-4 w-4" weight="duotone" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(manpower.id)}
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
            <DialogTitle>Add Manpower Entry</DialogTitle>
            <DialogDescription>
              Add a new manpower entry to the master data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role_description">Role Description*</Label>
              <Input
                id="role_description"
                name="role_description"
                value={formData.role_description}
                onChange={handleInputChange}
                placeholder="Enter role description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mll_grade">MLL Grade</Label>
              <Input
                id="mll_grade"
                name="mll_grade"
                value={formData.mll_grade}
                onChange={handleInputChange}
                placeholder="Enter MLL grade"
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
              <Label htmlFor="roll">Roll</Label>
              <Input
                id="roll"
                name="roll"
                value={formData.roll}
                onChange={handleInputChange}
                placeholder="Enter roll"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="ctc">CTC</Label>
              <Input 
                id="ctc" 
                name="ctc"
                type="number"
                value={formData.ctc}
                onChange={handleInputChange}
                placeholder="Enter CTC value"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSubmit}
              disabled={!formData.role_description}
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
            <DialogTitle>Edit Manpower Entry</DialogTitle>
            <DialogDescription>
              Update the manpower entry details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role_description">Role Description*</Label>
              <Input
                id="role_description"
                name="role_description"
                value={formData.role_description}
                onChange={handleInputChange}
                placeholder="Enter role description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mll_grade">MLL Grade</Label>
              <Input
                id="mll_grade"
                name="mll_grade"
                value={formData.mll_grade}
                onChange={handleInputChange}
                placeholder="Enter MLL grade"
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
              <Label htmlFor="roll">Roll</Label>
              <Input
                id="roll"
                name="roll"
                value={formData.roll}
                onChange={handleInputChange}
                placeholder="Enter roll"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="ctc">CTC</Label>
              <Input 
                id="ctc" 
                name="ctc"
                type="number"
                value={formData.ctc}
                onChange={handleInputChange}
                placeholder="Enter CTC value"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit}
              disabled={!formData.role_description}
            >
              Update Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 