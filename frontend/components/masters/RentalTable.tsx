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
import { rentalService } from "@/app/services/api";

type RentalTableProps = {
  obfId?: string;
};

type Rental = {
  id: string;
  obf_id: string;
  sl_no: number;
  location: string;
  rent_per_sqft: number;
  area: number;
};

// Sample BTS locations
const BTS_LOCATIONS = [
  "Mumbai - Andheri",
  "Mumbai - Malad",
  "Delhi - Gurgaon",
  "Delhi - Noida",
  "Bangalore - Electronic City",
  "Bangalore - Whitefield",
  "Chennai - OMR",
  "Chennai - Guindy",
  "Hyderabad - Hitech City",
  "Hyderabad - Gachibowli",
  "Pune - Hinjewadi",
  "Pune - Kharadi",
  "Kolkata - Salt Lake",
  "Kolkata - New Town",
  "Ahmedabad - SG Highway",
  "Ahmedabad - Bopal"
];

export default function RentalTable({ obfId = "obf1" }: RentalTableProps) {
  const [rentalData, setRentalData] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRental, setCurrentRental] = useState<Rental | null>(null);
  const [formData, setFormData] = useState({
    bts_location: "",
    rent_per_sqft: "",
    area: ""
  });
  const [customLocation, setCustomLocation] = useState("");
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRentalData = async () => {
      try {
        const response = await rentalService.getByObf(obfId);
        const data: Rental[] = response.data.map((item: any, index: number) => ({
          id: item.id,
          obf_id: item.obf_id,
          location: item.location,
          rent_per_sqft: item.rent_per_sqft,
          area: item.area,
          sl_no: index + 1
        }));
        setRentalData(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to fetch rental data");
      }
    };
    
    fetchRentalData();
  }, [obfId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    if (value === "custom") {
      setIsCustomLocation(true);
      setFormData(prev => ({
        ...prev,
        bts_location: ""
      }));
    } else {
      setIsCustomLocation(false);
      setFormData(prev => ({
        ...prev,
        bts_location: value
      }));
    }
  };

  const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCustomLocation(value);
    setFormData(prev => ({
      ...prev,
      bts_location: value
    }));
  };

  const handleAddSubmit = async () => {
    try {
      setError(null);
      
      // Validate form
      const locationValue = isCustomLocation ? customLocation : formData.bts_location;
      if (!locationValue.trim()) {
        setError("BTS Location is required.");
        return;
      }
      
      // Create new rental entry data
      const rentalEntry: Rental = {
        id: "", // This will be set by the backend
        obf_id: obfId,
        location: locationValue,
        rent_per_sqft: formData.rent_per_sqft ? parseFloat(formData.rent_per_sqft) : 0,
        area: formData.area ? parseFloat(formData.area) : 0,
        sl_no: rentalData.length + 1
      };
      
      // Send to API
      const newRental = await rentalService.create(rentalEntry);
      
      // Add to local state with sl_no
      setRentalData(prev => [
        ...prev, 
        {
          id: newRental.id,
          obf_id: newRental.obf_id,
          location: newRental.location,
          rent_per_sqft: newRental.rent_per_sqft,
          area: newRental.area,
          sl_no: prev.length + 1
        }
      ]);
      
      // Reset form and close dialog
      setFormData({
        bts_location: "",
        rent_per_sqft: "",
        area: ""
      });
      setCustomLocation("");
      setIsCustomLocation(false);
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to add rental entry");
    }
  };

  const handleEditClick = (rental: Rental) => {
    setCurrentRental(rental);
    setFormData({
      bts_location: rental.location,
      rent_per_sqft: String(rental.rent_per_sqft),
      area: String(rental.area)
    });
    
    // Check if location is in the predefined list
    const isCustom = !BTS_LOCATIONS.includes(rental.location);
    setIsCustomLocation(isCustom);
    if (isCustom) {
      setCustomLocation(rental.location);
    }
    
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!currentRental) return;
    
    try {
      setError(null);
      
      // Validate form
      const locationValue = isCustomLocation ? customLocation : formData.bts_location;
      if (!locationValue.trim()) {
        setError("BTS Location is required.");
        return;
      }
      
      // Update rental entry data
      const updatedRental: Rental = {
        ...currentRental,
        location: locationValue,
        rent_per_sqft: formData.rent_per_sqft ? parseFloat(formData.rent_per_sqft) : 0,
        area: formData.area ? parseFloat(formData.area) : 0
      };
      
      // Send to API
      await rentalService.update(currentRental.id, updatedRental);
      
      // Update local state
      setRentalData(prev => prev.map(item => 
        item.id === currentRental.id ? updatedRental : item
      ));
      
      // Reset form and close dialog
      setFormData({
        bts_location: "",
        rent_per_sqft: "",
        area: ""
      });
      setCustomLocation("");
      setIsCustomLocation(false);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update rental entry");
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rental entry?")) return;
    
    try {
      await rentalService.delete(id);
      setRentalData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to delete rental entry");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading rental data...</div>;
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
              Add Rental
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Rental Entry</DialogTitle>
              <DialogDescription>
                Add a new rental entry to the master data.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bts_location">BTS Location*</Label>
                {!isCustomLocation ? (
                  <Select 
                    onValueChange={handleSelectChange}
                    value={formData.bts_location}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select BTS location" />
                    </SelectTrigger>
                    <SelectContent>
                      {BTS_LOCATIONS.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Location</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter custom location"
                      value={customLocation}
                      onChange={handleCustomLocationChange}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsCustomLocation(false)}
                    >
                      Use Predefined Location
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rent_per_sqft">Rent Per Sq.ft. (₹)</Label>
                <Input
                  id="rent_per_sqft"
                  name="rent_per_sqft"
                  type="number"
                  step="0.01"
                  value={formData.rent_per_sqft}
                  onChange={handleInputChange}
                  placeholder="e.g. 75.50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  step="0.01"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Enter area"
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
          <TableCaption>List of rental entries in the master data.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Sl. No.</TableHead>
              <TableHead>BTS Location</TableHead>
              <TableHead>Rent Per Sq.ft. (₹)</TableHead>
              <TableHead>Area</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentalData.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell>{rental.sl_no}</TableCell>
                <TableCell>{rental.location}</TableCell>
                <TableCell>{rental.rent_per_sqft.toFixed(2)}</TableCell>
                <TableCell>{rental.area.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(rental)}>
                      <PencilSimple className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(rental.id)}>
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
            <DialogTitle>Edit Rental Entry</DialogTitle>
            <DialogDescription>
              Update the details of this rental entry.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_bts_location">BTS Location*</Label>
              {!isCustomLocation ? (
                <Select 
                  onValueChange={handleSelectChange}
                  value={formData.bts_location}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select BTS location" />
                  </SelectTrigger>
                  <SelectContent>
                    {BTS_LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Location</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter custom location"
                    value={customLocation}
                    onChange={handleCustomLocationChange}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsCustomLocation(false)}
                  >
                    Use Predefined Location
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_rent_per_sqft">Rent Per Sq.ft. (₹)</Label>
              <Input
                id="edit_rent_per_sqft"
                name="rent_per_sqft"
                type="number"
                step="0.01"
                value={formData.rent_per_sqft}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_area">Area</Label>
              <Input
                id="edit_area"
                name="area"
                type="number"
                step="0.01"
                value={formData.area}
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