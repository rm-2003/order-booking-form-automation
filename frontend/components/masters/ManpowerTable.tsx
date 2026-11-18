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

type ManpowerTableProps = {
  obfId?: string;
};

type Manpower = {
  id: string;
  obf_id: string;
  sr_no: number;
  role_description: string;
  mll_grade: string;
  category: string;
  roll: string;
  ctc: number;
};

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
  "Executive (Safety- Supervisor)", "Executive- Functional in-charge", "Executive Inventory", "Executive Operation",
  "Executive/Officer", "Executive/Officer-Put Away", "Executive/Sr. Executive -out", "Executives/Supervisor",
  "Facility Admin", "FG in-charge-CPG", "Fixed Das", "Fixed Loaders",
  "Fixed Security", "FL Operator", "Floor Supervisor", "FLT Operator",
  "Fork Lift Driver (FLD)", "FTC (Operation DEO)", "FTC (Operation Supervisor)", "Gas Cutter",
  "General Trade Planner", "Godrej 1.5T  Stacker , MFH-6000 mm Driver", 
  "Godrej 2 T Articulated forklift truck, MFH-9000 mm Driver", "Grader/ Sorter",
  "Group leader", "Gunman", "Helpers", "Highly Skilled",
  "HLOP Operator", "House Keeping at WH ( Un Skilled )", "House Keeping/Office boy- Sindhu", "Housekeeper",
  "HR", "HR & Admin Executive", "HR / Administration", "HR + Admin",
  "HR and Safety Executive", "HR- Deputy Manager", "HR Executive", "HR in-charge",
  "HR Lead", "HR Manager", "HR/Admin/Safety Officer", "Hub in-charge",
  "IB Executive", "IB IRN Skilled", "IB Material checking", "IB QC Skilled",
  "IB QC Skilled, IB LBH Skilled", "IB Semi-Skilled", "IB Skilled", "IB Unloader",
  "IB Unloader and OB Loader", "ICQA Executive", "ICQA Supervisor", "ICQA-Semiskilled"
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

export default function ManpowerTable({ obfId = "obf1" }: ManpowerTableProps) {
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

  useEffect(() => {
    const fetchManpowerData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mastersApi.manpower.getByObf(obfId);
        
        // Add sr_no to each item if not present
        const dataWithSrNo = data.map((item: any, index: number) => ({
          ...item,
          sr_no: item.sr_no || index + 1
        }));
        
        setManpowerData(dataWithSrNo);
      } catch (err) {
        console.error("Failed to fetch manpower data:", err);
        setError(err instanceof Error ? err.message : "Failed to load manpower data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchManpowerData();
  }, [obfId]);

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

  const handleAddSubmit = async () => {
    try {
      setError(null);
      
      // Validate form
      if (!formData.role_description.trim()) {
        setError("Role description is required.");
        return;
      }
      
      // Create new manpower entry data
      const manpowerEntry = {
        obf_id: obfId,
        sr_no: manpowerData.length + 1,
        role_description: formData.role_description,
        mll_grade: formData.mll_grade,
        category: formData.category,
        roll: formData.roll,
        ctc: formData.ctc ? parseFloat(formData.ctc) : 0
      };
      
      // Send to API
      const newManpower = await mastersApi.manpower.create(manpowerEntry);
      
      // Add to local state
      setManpowerData(prev => [...prev, newManpower]);
      
      // Reset form and close dialog
      setFormData({
        role_description: "",
        mll_grade: "",
        category: "",
        roll: "",
        ctc: ""
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to add manpower entry");
    }
  };

  const handleEditClick = (manpower: Manpower) => {
    setCurrentManpower(manpower);
    setFormData({
      role_description: manpower.role_description,
      mll_grade: manpower.mll_grade,
      category: manpower.category,
      roll: manpower.roll,
      ctc: String(manpower.ctc)
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!currentManpower) return;
    
    try {
      setError(null);
      
      // Validate form
      if (!formData.role_description.trim()) {
        setError("Role description is required.");
        return;
      }
      
      // Update manpower entry data
      const manpowerEntry = {
        obf_id: obfId,
        sr_no: currentManpower.sr_no,
        role_description: formData.role_description,
        mll_grade: formData.mll_grade,
        category: formData.category,
        roll: formData.roll,
        ctc: formData.ctc ? parseFloat(formData.ctc) : 0
      };
      
      // Send to API
      await mastersApi.manpower.update(currentManpower.id, manpowerEntry);
      
      // Update local state
      setManpowerData(prev => 
        prev.map(item => item.id === currentManpower.id ? {
          ...item,
          ...manpowerEntry
        } : item)
      );
      
      // Reset form and close dialog
      setCurrentManpower(null);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update manpower entry");
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this manpower entry?")) {
      try {
        setError(null);
        
        // Send to API
        await mastersApi.manpower.delete(id);
        
        // Update local state
        const updatedData = manpowerData.filter(item => item.id !== id);
        
        // Renumber the entries
        const renumberedData = updatedData.map((item, index) => ({
          ...item,
          sr_no: index + 1
        }));
        
        setManpowerData(renumberedData);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to delete manpower entry");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading manpower data...</div>;
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
              Add Manpower
            </Button>
          </DialogTrigger>
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
                <Select 
                  onValueChange={(value) => handleSelectChange(value, "role_description")}
                  value={formData.role_description}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role description" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_DESCRIPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mll_grade">MLL Grade</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange(value, "mll_grade")}
                  value={formData.mll_grade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select MLL grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {MLL_GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange(value, "category")}
                  value={formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roll">Roll</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange(value, "roll")}
                  value={formData.roll}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select roll" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLLS.map((roll) => (
                      <SelectItem key={roll} value={roll}>
                        {roll}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ctc">CTC (₹)</Label>
                <Input
                  id="ctc"
                  name="ctc"
                  type="number"
                  value={formData.ctc}
                  onChange={handleInputChange}
                  placeholder="e.g. 1200000"
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
          <TableCaption>List of manpower entries in the master data.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Role Description</TableHead>
              <TableHead>MLL Grade</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Roll</TableHead>
              <TableHead>CTC (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manpowerData.map((manpower) => (
              <TableRow key={manpower.id}>
                <TableCell>{manpower.sr_no}</TableCell>
                <TableCell>{manpower.role_description}</TableCell>
                <TableCell>{manpower.mll_grade}</TableCell>
                <TableCell>{manpower.category}</TableCell>
                <TableCell>{manpower.roll}</TableCell>
                <TableCell>{manpower.ctc.toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(manpower)}>
                      <PencilSimple className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(manpower.id)}>
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
            <DialogTitle>Edit Manpower Entry</DialogTitle>
            <DialogDescription>
              Update the details of this manpower entry.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_role_description">Role Description*</Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value, "role_description")}
                value={formData.role_description}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role description" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_DESCRIPTIONS.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_mll_grade">MLL Grade</Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value, "mll_grade")}
                value={formData.mll_grade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select MLL grade" />
                </SelectTrigger>
                <SelectContent>
                  {MLL_GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_category">Category</Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value, "category")}
                value={formData.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_roll">Roll</Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value, "roll")}
                value={formData.roll}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select roll" />
                </SelectTrigger>
                <SelectContent>
                  {ROLLS.map((roll) => (
                    <SelectItem key={roll} value={roll}>
                      {roll}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_ctc">CTC (₹)</Label>
              <Input
                id="edit_ctc"
                name="ctc"
                type="number"
                value={formData.ctc}
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