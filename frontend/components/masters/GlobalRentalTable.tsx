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

type Rental = {
  id: string;
  sr_no: number;
  location: string;
  area_sqft: number;
  rent_per_sqft: number;
  created_at: string;
  updated_at: string;
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

export default function GlobalRentalTable() {
  const [rentalData, setRentalData] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRental, setCurrentRental] = useState<Rental | null>(null);
  const [formData, setFormData] = useState({
    sr_no: 1,
    location: '',
    area_sqft: 0,
    rent_per_sqft: 0
  });
  const [customLocation, setCustomLocation] = useState("");
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await mastersApi.rental.getAll();
      setRentalData(response);
      setError(null);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      setError('Failed to fetch rental data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

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
        location: ""
      }));
    } else {
      setIsCustomLocation(false);
      setFormData(prev => ({
        ...prev,
        location: value
      }));
    }
  };

  const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCustomLocation(value);
    setFormData(prev => ({
      ...prev,
      location: value
    }));
  };

  const resetForm = () => {
    setFormData({
      sr_no: 1,
      location: '',
      area_sqft: 0,
      rent_per_sqft: 0
    });
    setCustomLocation("");
    setIsCustomLocation(false);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (rental: Rental) => {
    setCurrentRental(rental);
    setFormData({
      sr_no: rental.sr_no,
      location: rental.location,
      area_sqft: rental.area_sqft,
      rent_per_sqft: rental.rent_per_sqft
    });
    
    // Check if location is in the predefined list
    const isCustom = !BTS_LOCATIONS.includes(rental.location);
    setIsCustomLocation(isCustom);
    if (isCustom) {
      setCustomLocation(rental.location);
    }
    
    setIsEditDialogOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        sr_no: formData.sr_no,
        location: formData.location,
        area_sqft: formData.area_sqft,
        rent_per_sqft: formData.rent_per_sqft
      };
      
      await mastersApi.rental.create(payload);
      setIsAddDialogOpen(false);
      setFormData({
        sr_no: 1,
        location: '',
        area_sqft: 0,
        rent_per_sqft: 0
      });
      fetchRentals();
    } catch (error) {
      console.error('Error adding rental:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRental) return;
    
    try {
      const payload = {
        sr_no: formData.sr_no,
        location: formData.location,
        area_sqft: formData.area_sqft,
        rent_per_sqft: formData.rent_per_sqft
      };
      
      await mastersApi.rental.update(currentRental.id, payload);
      setIsEditDialogOpen(false);
      setCurrentRental(null);
      setFormData({
        sr_no: 1,
        location: '',
        area_sqft: 0,
        rent_per_sqft: 0
      });
      fetchRentals();
    } catch (error) {
      console.error('Error updating rental:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rental entry?")) {
      return;
    }
    
    try {
      await mastersApi.rental.delete(id);
      
      // Update local state
      setRentalData(prev => prev.filter(item => item.id !== id));
      
      toast.success("Rental entry deleted successfully");
    } catch (err) {
      console.error("Failed to delete rental entry:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete rental entry");
    }
  };

  const calculateMonthlyRent = (area: number, ratePerSqft: number): string => {
    const totalRent = area * ratePerSqft;
    return totalRent.toLocaleString('en-IN');
  };

  // Filter rentalData based on search query
  const filteredRentalData = rentalData.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.location.toLowerCase().includes(q) ||
      String(item.sr_no).includes(q) ||
      String(item.area_sqft).includes(q) ||
      String(item.rent_per_sqft).includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Rental Data</h2>
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
        {/* <h2 className="text-lg font-medium">Rental Master Data</h2> */}
        <div className="flex items-center gap-2 relative">
          <MagnifyingGlass className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <Input
            placeholder="Search Rental..."
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
              <TableHead>Sr No</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Area (sq ft)</TableHead>
              <TableHead>Rent per sq ft</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRentalData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-6 text-muted-foreground">
                  No rental data available. Click 'Add Entry' to create one.
                </TableCell>
              </TableRow>
            ) : (
              filteredRentalData.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.sr_no}</TableCell>
                  <TableCell>{rental.location}</TableCell>
                  <TableCell>{(rental.area_sqft || 0).toLocaleString('en-IN')}</TableCell>
                  <TableCell>{(rental.rent_per_sqft || 0).toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    {((rental.area_sqft || 0) * (rental.rent_per_sqft || 0)).toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(rental)}
                      >
                        <PencilSimple className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(rental.id)}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Rental Entry</DialogTitle>
            <DialogDescription>
              Add a new rental entry to the master data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sr_no" className="text-right">
                Sr No
              </Label>
              <Input
                id="sr_no"
                type="number"
                value={formData.sr_no}
                onChange={(e) => setFormData({ ...formData, sr_no: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area_sqft" className="text-right">
                Area (sq ft)
              </Label>
              <Input
                id="area_sqft"
                type="number"
                value={formData.area_sqft}
                onChange={(e) => setFormData({ ...formData, area_sqft: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rent_per_sqft" className="text-right">
                Rent per sq ft
              </Label>
              <Input
                id="rent_per_sqft"
                type="number"
                value={formData.rent_per_sqft}
                onChange={(e) => setFormData({ ...formData, rent_per_sqft: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSubmit}
              disabled={!(isCustomLocation ? customLocation : formData.location)}
            >
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Rental Entry</DialogTitle>
            <DialogDescription>
              Update the rental entry details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sr_no" className="text-right">
                Sr No
              </Label>
              <Input
                id="sr_no"
                type="number"
                value={formData.sr_no}
                onChange={(e) => setFormData({ ...formData, sr_no: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area_sqft" className="text-right">
                Area (sq ft)
              </Label>
              <Input
                id="area_sqft"
                type="number"
                value={formData.area_sqft}
                onChange={(e) => setFormData({ ...formData, area_sqft: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rent_per_sqft" className="text-right">
                Rent per sq ft
              </Label>
              <Input
                id="rent_per_sqft"
                type="number"
                value={formData.rent_per_sqft}
                onChange={(e) => setFormData({ ...formData, rent_per_sqft: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 