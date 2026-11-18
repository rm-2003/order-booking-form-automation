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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { mastersApi } from "@/lib/api";

type CapexTableProps = {
  obfId?: string;
};

type Capex = {
  id: string;
  obf_id: string;
  sl_no: number;
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

// Asset description options
const ASSET_DESCRIPTIONS = [
  "10 KVA 1 Phase With AMF Panel  (Without Installation)",
  "10 KVA 1 Phase With MCP (Without Installation)",
  "10 KVA 3 Phase With AMF Panel  (Without Installation)",
  "10 KVA 3 Phase With MCP  (Without Installation)",
  "100 KVA 3 Phase With AMF Panel  (Without Installation)",
  "100 KVA 3 Phase With MCP  (Without Installation)",
  "125 KVA 3 Phase With AMF Panel  (Without Installation)",
  "125 KVA 3 Phase With MCP  (Without Installation)",
  "15 KVA 1 Phase With AMF Panel  (Without Installation)",
  "15 KVA 1 Phase With MCP (Without Installation)",
  "15 KVA 3 Phase With AMF Panel  (Without Installation)",
  "15 KVA 3 Phase With MCP  (Without Installation)",
  "160 KVA 3 Phase With AMF Panel  (Without Installation)",
  "160 KVA 3 Phase With MCP  (Without Installation)",
  "20 KVA 1 Phase With AMF Panel  (Without Installation)",
  "20 KVA 1 Phase With MCP (Without Installation)",
  "20 KVA 3 Phase With AMF Panel  (Without Installation)",
  "20 KVA 3 Phase With MCP  (Without Installation)",
  "200 KVA 3 Phase With AMF Panel  (Without Installation)",
  "200 KVA 3 Phase With MCP  (Without Installation)",
  "25 KVA 3 Phase With AMF Panel  (Without Installation)",
  "25 KVA 3 Phase With MCP  (Without Installation)",
  "250 KVA 3 Phase With AMF Panel  (Without Installation)",
  "250 KVA 3 Phase With MCP  (Without Installation)",
  "30 KVA 3 Phase With AMF Panel  (Without Installation)",
  "30 KVA 3 Phase With MCP  (Without Installation)",
  "35 KVA 3 Phase With AMF Panel  (Without Installation)",
  "35 KVA 3 Phase With MCP  (Without Installation)",
  "40 KVA 3 Phase With AMF Panel  (Without Installation)",
  "40 KVA 3 Phase With MCP  (Without Installation)",
  "45 KVA 3 Phase With AMF Panel  (Without Installation)",
  "45 KVA 3 Phase With MCP  (Without Installation)",
  "4-in-1 (Fax, printer, Scaner & copier) - 1000 copy per day",
  "4-in-1 (Fax, printer, Scaner & copier) - 500 copy per day",
  "4-in-1 (Fax, printer, Scaner & copier) - 5000 copy per day",
  "50 KVA 3 Phase With AMF Panel  (Without Installation)",
  "50 KVA 3 Phase With MCP  (Without Installation)",
  "58.5 KVA 3 Phase With AMF Panel  (Without Installation)",
  "58.5 KVA 3 Phase With MCP  (Without Installation)",
  "62.5 KVA 3 Phase With AMF Panel  (Without Installation)",
  "62.5 KVA 3 Phase With MCP  (Without Installation)",
  "82.5 KVA 3 Phase With AMF Panel  (Without Installation)",
  "82.5 KVA 3 Phase With MCP  (Without Installation)",
  "Access control point",
  "Air Circulater 36\" wall mount fans + Material & fitting",
  "Air Conditioner - Split 1 Ton",
  "Air Conditioner - Split 2 Ton",
  "Air Conditioner - Window 1 Ton",
  "Air Conditioner - Window 2 Ton",
  "Air curtain - 3ft width / Door height - 10 ft",
  "Air curtain - 4ft width / Door height - 10 ft",
  "Air curtain - 6ft width / Door height - 10 ft",
  "Air curtain - 9ft width / Door height - 10 ft",
  "Aircon Room Setup (Height - 10ft)",
  "AM-OM Trolley (for Laptop & Printer Carrying)",
  "Aquaguard Capacity 15 ltrs",
  "Articulated Forklift  with Battery & Charger + Camera - Reach Height 12.5 mtr / Cap 2.0 Ton (Godrej)",
  "Articulated Forklift  with Battery & Charger + Camera - Reach Height 7.5 mtr / Cap 1.4 Ton (Godrej)",
  "Articulated Forklift  with Battery & Charger + Camera - Reach Height 9.0 mtr / Cap 1.8 Ton (Godrej)",
  "Attendance System",
  "Bag Sealing Machine",
  "Barcode printer",
  "Barcode scanner (wired)",
  "Breath Analyzer",
  "Bubble Pack machine",
  "Cage Trolley - 650 (L) x 450 (W) x 1000 (H)",
  "Camera system with color monitor for Reach Truck  (Godrej)",
  "Canopy - 3.5 mtr (L) x 4 mtr (W)",
  "Canteen Facility (AC)",
  "Canteen Facility (non-AC)",
  "Carton Box - 300 mm (W) x 200 mm (D) x 150 mm (H)",
  "Carton Box - 450 mm (W) x 300 mm (D) x 300 mm (H)",
  "CCTV Cabling",
  "CCTV DVR - 16 cameras",
  "CCTV DVR - 4 cameras",
  "CCTV DVR - 8 cameras",
  "CCTV Harddisk - 30 days storage (1 TB)",
  "CCTV Harddisk - 90 days storage (3 TB)",
  "CCTV Indoor camera (night vision) - Range 15 mtr",
  "CCTV Outdoor camera (night vision) - Range 30 mtr",
  "CCTV Screen - 56 inch",
  "CCTV Unit set - with DVR and 16 Camera",
  "CCTV Unit set - with DVR with 4 Camera",
  "Changing room - 3 ft (W) x 3 ft (D) x 7 ft (H)",
  "Cold Room - 10 ft height",
  "Convex miror with Shed (cap like projection)",
  "Data Card",
  "Deep Frezzer -  500 ltr - Temp upto -40 Deg",
  "Desktop computer",
  "Diesel Forklift (Godrej) - Reach Height 3.0 mtr / Cap 5.0 Ton",
  "Diesel Forklift (Godrej) - Reach Height 4.5 mtr / Cap 1.5 Ton",
  "Diesel Forklift (Godrej) - Reach Height 4.5 mtr / Cap 2.0 Ton",
  "Diesel Forklift (Godrej) - Reach Height 4.5 mtr / Cap 3.0 Ton",
  "Digital Camera - 7 Megapixel",
  "Display Boards",
  "Dock Bumpers",
  "Dock Leveller (Maini) -  Capacity 5 ton 2.0 mtr (W) x 2.2 mtr (L)",
  "Dock Leveller (Maini) -  Capacity 9 ton 2.1 mtr (W) x 2.7 mtr (L)",
  "Dock Shelter",
  "Dock Table & chairs + 4 More Chairs",
  "Dot Matrix printer - EPSON - LQ 1150",
  "Dot Matrix printer - EPSON - LQ 2180",
  "Dot Matrix printer - EPSON - LX 300",
  "Double Deep Reach Truck (Pantograph) (Jungheinrich) with Battery & Charger - Reach Height 11.3 mtr / Cap 1.6 MT (Model - ETR 335d GNE107 1135DZ)",
  "Double Deep Reach Truck (Telescopic forks) (Jungheinrich) with Battery & Charger - Reach Height 11.5 mtr / Cap 2 MT (Model - ETV MC320 GNE115 1151DZ)",
  "E-Hand Pallet Truck  - Cap 1.5 ton with lithium battery (Jungheinrich)",
  "Electric Stacker (Jungheinrich) with Battery & Charger - Reach Height 5.23 mtr / Cap 1.6 Ton (Model - EJC BB216)",
  "Electric Stacker (Jungheinrich) with Battery & Charger & Operator Platform - Reach Height 5.43 mtr / Cap 1.6 Ton (Model - ERC BB216)",
  "Electric Stacker with Battery & Charger - Reach Height 6.3 mtr / Cap 1.5 Ton (Godrej)",
  "Electrification - 2-tier Shelving area",
  "Electrification - 3-tier Shelving area",
  "Electrification - Standard",
  "Elevator Lift  - Reach Height 2.5 mtr / Cap 1.0 Ton",
  "Elevator Lift  - Reach Height 6.0 mtr / Cap 1.0 Ton",
  "Emergency LED Light",
  "Emergency Lighting",
  "Emergency Lighting - 2 Beams",
  "Emergency Lighting - Hand Hed",
  "EPBAX system",
  "Exhaust Fan - 18\"",
  "Exhaust Fan - 24\"",
  "Extra Battery Double Deep Reach Truck (Telescopic forks) (Jungheinrich)- Reach Height 11.5 mtr / Cap 2 MT Local",
  "Extra Battery Electric Stacker (Jungheinrich) - Reach Height 5.23 mtr / Cap 1.6 Ton (Model - EJC BB216)",
  "Extra Battery Electric Stacker (Jungheinrich) - Reach Height 5.43 mtr / Cap 1.6 Ton (Model - ERC BB216)",
  "Extra Battery Long Fork Power Pallet Truck (Jungheinrich) - Cap 2.0 ton (Model ERE MA120 G240)",
  "Extra Battery Long Fork Power Pallet Truck (Jungheinrich) - Cap 2.0 ton (Model ERE MB225 G240)",
  "Extra Battery Power Pallet Truck (Jungheinrich) - Cap 2 ton (Model ERE BB220)",
  "Extra Battery Power Pallet Truck (Jungheinrich) - Cap 2.5 ton (Model ERE MB225)",
  "Extra Battery Reach Truck (Jungheinrich)  -  Reach Height 10.7 mtr / Cap 1.6 Ton (Model - ETV MB216)",
  "Extra Battery Reach Truck (Jungheinrich)  -  Reach Height 11.5 mtr / Cap 2 Ton (Model - ETV MC320)",
  "Extra Battery Reach Truck (Jungheinrich)  - Reach Height 9 mtr / Cap 1.4 Ton (Model - ETV MB214)",
  "Extra Battery Tow Truck (Jungheinrich) with Battery & Charger - Cap 3.0 ton (Model - EZS MB230 )",
  "Extra Battery Tow Truck (Jungheinrich) with Battery & Charger - Cap 5.0 ton (Model - EZS 350 )",
  "Eyewash",
  "False Ceiling",
  "Filing Cabinets - 2 ft (W) x 1.5 ft (D) x 4 ft (H) - 4 levels",
  "Fire Alarm ( manual Siren )",
  "Fire Alarm Detectors",
  "Fire Extinguisher - ABC type - 4 kg",
  "Fire Extinguisher - ABC type - 6 kg",
  "Fire Extinguisher - ABC type - 9 kg",
  "Fire Extinguisher - BC Type - 50 kg",
  "Fire Extinguisher - CM FE36 Clean Agent - 10 kgs",
  "Fire Extinguisher - CO2 type -  4.5 kg",
  "Fire Extinguisher CM ABC Type - 10 kgs",
  "Fire Extinguisher Foam Type - 50 ltr",
  "Fire Extinguisher Foam Type - 9 ltr",
  "Fire Safety Buckets",
  "First Aid Box",
  "Floor Cleaning machine 60ltr",
  "Flooring - Anti-static",
  "Flooring - Epoxy - 1 mm thick",
  "Flooring - Linolium - 0.5 mm thick",
  "Flooring - PVC - 1 mm thick",
  "Flooring - PVC - 3 mm thick",
  "Forklift (Godrej) with Battery & Charger - Reach Height 3.0 mtr / Cap 3.0 Ton",
  "Forklift (Godrej) with Battery & Charger - Reach Height 3.0 mtr / Cap 5.0 Ton",
  "Forklift (Godrej) with Battery & Charger - Reach Height 4.5 mtr / Cap 1.5 Ton",
  "Forklift (Godrej) with Battery & Charger - Reach Height 4.5 mtr / Cap 2.0 Ton",
  "Forklift (Godrej) with Battery & Charger - Reach Height 4.5 mtr / Cap 2.5 Ton",
  "Forklift (Godrej) with Battery & Charger - Reach Height 4.5 mtr / Cap 3.0 Ton",
  "Forklift (Hyundai) with lithium Battery & Charger - Reach Height 6 mtr / Cap 2 Ton (Model -  20B-9F)",
  "Forklift (Jungheinrich) Extra Battery - Reach Height 4.4 mtr / Cap 3 Ton (Model - EFG BC330)",
  "Forklift (Jungheinrich) Extra Battery - Reach Height 4.8 mtr / Cap 1.6 Ton (Model - EFG BB216k)",
  "Forklift (Jungheinrich) Extra Battery - Reach Height 4.8 mtr / Cap 2 Ton (Model - EFG BB320)",
  "Forklift (Jungheinrich) with Battery & Charger - Reach Height 4.4 mtr / Cap 3 Ton (Model - EFG BC330)",
  "Forklift (Jungheinrich) with Battery & Charger - Reach Height 4.8 mtr / Cap 1.6 Ton (Model - EFG BB216k)",
  "Forklift (Jungheinrich) with Battery & Charger - Reach Height 4.8 mtr / Cap 2 Ton (Model - EFG BB320)",
  "Garbage Bins",
  "Gate Pass set up ( PC+Camera+Printer)",
  "Hand Pallet Truck  - Cap 2.0 ton (Godrej)",
  "Hand Pallet Truck  - Cap 2.3 ton (Crown)",
  "Hand Pallet Truck  - Cap 2.5 ton (Nilkamal)",
  "Hanging Tubelight with Chain",
  "Heat Sealing Machine",
  "Hi Reach Ladder ( Liftman ) - mechanised",
  "High Rise Ladder - for cleaning & Maintainence (Reach height - 15 mtr)",
  "Industrial Scubber",
  "Ink Jet Printers",
  "Insect Killer",
  "Intruder alarm point",
  "Inverter - 1000 VA",
  "Inverter - 1400 VA",
  "Inverter - 2000 VA",
  "Inverter - 800 VA",
  "IT Connectivity",
  "Key Holder Stand",
  "Lable Applicator",
  "Landline Telephone",
  "Laptop",
  "Laser printer - HP Office Jet 6208 (Printer Scaner & Photo Copier)",
  "Laser printer - HP1020",
  "Layout / Yard Marking",
  "Lockers - 1.25 ft (W) x 1.5 ft (D) x 1 ft (H) - 6 levels",
  "Long Fork Power Pallet Truck (Jungheinrich) with Battery & Charger - Cap 2.0 ton (Model ERE MA120 G240)",
  "Long Fork Power Pallet Truck (Jungheinrich) with Battery & Charger - Cap 2.0 ton (Model ERE MB225 G240)",
  "Long Span Shelving –  1200 mm (W) x 300 mm (D) x 250 mm (H) x 7 Levels - 50 kg/Level",
  "Long Span Shelving –  1200 mm (W) x 450 mm (D) x 350 mm (H) x 6 Levels - 100 kg/Level",
  "Long Span Shelving –  3000 mm (W) x 600 mm (D) x 600 mm (H) x 4 Levels - 100 kg/Level",
  "Lunch table",
  "Manual Chain Pulley 2 MT",
  "Metal Detector - Hand Frisker",
  "Metal Detector - Walk Through (12 zone)",
  "Metal Detector - Walk Through (8 Zone)",
  "Metal Stool",
  "Microwave",
  "Mobile Phone with High resolution Camera",
  "Model WH CAPEX + Signages",
  "Motion Sensors",
  "Office Setup - Basic",
  "Office Setup - Premium",
  "Office Setup - Standard",
  "Order Picker (Jungheinrich) with Battery & Charger - Reach Height 8.0 mtr / Cap 1.0 Ton",
  "Packing Table with Top (4 ft L x 3 ft W)",
  "Packing Table with Top (6ft L x 4 ft W)",
  "Pallet (Metal) - 1.2 mtr (W) x 1.0 mtr (D) - Cap 1.0 Ton",
  "Pallet (Metal) - 1.22 mtr (W) x 1.22 mtr (D) - Cap 1.0 Ton",
  "Pallet (Plastic for Block-stack) - 1.2 mtr (W) x 1.0 mtr (D) - Cap 1.0 Ton",
  "Pallet (Plastic for Block-stack) - 1.22 mtr (W) x 1.22 mtr (D) - Cap 1.0 Ton",
  "Pallet (Plastic for Racking) - 1.2 mtr (W) x 1.0 mtr (D) - Cap 1.0 Ton",
  "Pallet (Plastic for Racking) - 1.22 mtr (W) x 1.22 mtr (D) - Cap 1.0 Ton",
  "Pallet (Wooden for Drive-In Racks) - 1.22 mtr (W) x 1.22 mtr (D) - Cap 1.0 Ton",
  "Pallet (Wooden) - 1.2 mtr (W) x 1.0 mtr (D) - Cap 1.0 Ton",
  "Pallet (Wooden) - 1.22 mtr (W) x 1.22 mtr (D) - Cap 1.0 Ton",
  "Pallet Racking (APRS) - 1.2 mtr (W) x 1.0 mtr (D) x 1.35 mtr (H) - Cap 0.5 Ton",
  "Pallet Racking (APRS) - 1.2 mtr (W) x 1.0 mtr (D) x 1.35 mtr (H) - Cap 1.0 Ton",
  "Pallet Racking (APRS) - 1.22 mtr (W) x 1.22 mtr (D) x 1.35 mtr (H) - Cap 0.5 Ton",
  "Pallet Racking (APRS) - 1.22 mtr (W) x 1.22 mtr (D) x 1.35 mtr (H) - Cap 1.0 Ton",
  "Pallet Racking (DRIVE-IN) - 1.2 mtr (W) x 1.0 mtr (D) x 1.35 mtr (H) - Cap 1.0 Ton",
  "Pedestal Fan - 24\"",
  "Pedestal Fan - 36\"",
  "Picking Ladder",
  "Picking Trolley - 900 mm (L) x 600 mm (W) x 450 mm (H) 3 level",
  "Plastic Bins - 150 mm (W) x 100 mm (D) x 75 mm (H)",
  "Plastic Bins - 300 mm (W) x 200 mm (D) x 150 mm (H)",
  "Plastic Bins - 600 mm (W) x 400 mm (D) x 320 mm (H)",
  "Platform Trolley",
  "Power Pallet Truck (Jungheinrich) with Battery & Charger - Cap 1.5 ton (Model AME15)",
  "Power Pallet Truck (Jungheinrich) with Battery & Charger - Cap 2 ton (Model ERE BB220)",
  "Power Pallet Truck (Jungheinrich) with Battery & Charger - Cap 2.5 ton (Model ERE MB225)",
  "Public Addressing System",
  "PVC Curtain - 3mm thick, transperancy 95%, overlapping 50%, width 200mm",
  "PVC Curtain - 3mm thick, transperancy 99.2%, overlapping 50%, width 200mm",
  "Reach Truck (Crown) with Battery & Charger - Reach Height 10 mtr / Cap 1.6 Ton",
  "Reach Truck (Crown) with Battery & Charger - Reach Height 8.5 mtr / Cap 1.6 Ton",
  "Reach Truck (Double Deep) (Crown) with Battery & Charger - Reach Height 10 mtr / Cap 1.4 Ton",
  "Reach Truck (Godrej) with Battery & Charger - Reach Height 11 mtr / Cap 2.0 Ton",
  "Reach Truck (Godrej) with Battery & Charger - Reach Height 12 mtr / Cap 2.0 Ton",
  "Reach Truck (Godrej) with Battery & Charger - Reach Height 7.4 mtr / Cap 1.6 Ton",
  "Reach Truck (Godrej) with Battery & Charger - Reach Height 9.0 mtr / Cap 1.6 Ton",
  "Reach Truck (Hyundai) -  Reach Height 10.5 mtr / Cap 2 Ton (Model -  20BRJ-9)",
  "Reach Truck (Hyundai) -  Reach Height 11 mtr / Cap 2 Ton (Model -  20BRJ-9)",
  "Reach Truck (Jungheinrich) with Battery & Charger - Reach Height 10.7 mtr / Cap 1.6 Ton (Model - ETV MB216)",
  "Reach Truck (Jungheinrich) with Battery & Charger - Reach Height 11.5 mtr / Cap 2 Ton (Model - ETV MC320)",
  "Reach Truck (Jungheinrich) with Battery & Charger - Reach Height 9 mtr / Cap 1.4 Ton (Model - ETV MB214)",
  "Refrigerator 200ltr",
  "Refrigerator 350ltr",
  "RF Hand held terminal with Battery + charger - Honeywell",
  "RF Hand held terminal with Battery + charger - Motorola",
  "RO - Elite 1 - 25 litres per hour",
  "RO - Elite 2 - 50 litres per hour",
  "RO With water Cooler",
  "ROTO  Moulded Wheel bins - 660 ltrs (Nilkamal)",
  "Rubber Foot Mat",
  "Safe - 1.25 ft (W) x 1.5 ft (D) x 1 ft (H)",
  "Safety Video Display TV ( MLL Safety )",
  "Scrap disposal area",
  "Seal machine - Box-sealing tape",
  "Shrink wrap Machine",
  "Signage",
  "Slotted Angle Shelving –  1200 mm (W) x 450 mm (D) x 350 mm (H) x 6 Levels - 100 kg/Level",
  "Slotted Angle Shelving –  1200 mm (W) x 600 mm (D) x 400 mm (H) x 6 Levels - 100 kg/Level",
  "Slotted Angle Shelving –  1200 mm (W) x 600 mm (D) x 600 mm (H) x 4 Levels - 100 kg/Level",
  "Slotted Angle Shelving –  900 mm (W) x 450 mm (D) x 600 mm (H) x 4 Levels - 100 kg/Level",
  "Slotted Angle Shelving –  900 mm (W) x 600 mm (D) x 400 mm (H) x 6 Levels - 100 kg/Level",
  "Slotted Angle Shelving –  900 mm (W) x 600 mm (D) x 600 mm (H) x 4 Levels - 100 kg/Level",
  "Smoke Detectors stand alone unit",
  "Spare batteries for Articulated Electric Forklift Cap 1.5 Ton (Godrej)",
  "Spare batteries for Electric Forklift Cap 1 Ton",
  "Spare batteries for Electric Forklift Cap 2.0 Ton",
  "Spare batteries for Electric Forklift Cap 2.5 Ton",
  "Spare batteries for Electric Forklift Cap 3.0 Ton",
  "Spare batteries for Electric Forklift Cap 5.0 Ton",
  "Spare Batteries for Power Pallet Truck 2.0 Ton (Godrej)",
  "Spare Batteries for Reach Truck",
  "Spare Batteries for Tow Truck 2.0 Ton",
  "Spare Battery - Stacker (Godrej)",
  "Speaker for Laptop",
  "Speed bumpers",
  "Steel Cupboard - 40\" (W) x 20\" (D) x 78\" (H)",
  "Step Ladder",
  "Strapping Machine - Manual",
  "Strapping Machine - Semi Automatic",
  "Stretch wrapping machine - Manual",
  "Stretch wrapping machine - Semi-Automatic - Carton",
  "Stretch wrapping machine - Semi-Automatic - Pallet",
  "Suggestion Box",
  "Taping Machine - Manual",
  "Tea/ Coffee Vending Machine ( 3 selection option)",
  "Temperature data logger (Testo make)",
  "Temperature Indicator (Local brands) Manual temp. log",
  "Torch",
  "Tow Truck (Hyundai) with Battery & Charger - Cap 4.0 ton (Model - 40T-9 )",
  "Tow Truck (Jungheinrich) with Battery & Charger - Cap 3.0 ton (Model - EZS MB230 )",
  "Tow Truck (Jungheinrich) with Battery & Charger - Cap 5.0 ton (Model - EZS 350 )",
  "Tow Truck with Battery & Charger - Cap 2.0 ton (Godrej)",
  "Tow Truck with Battery & Charger - Cap 5.0 ton (Godrej)",
  "Trolley Double Deep Reach Truck (Telescopic forks) (Jungheinrich) - Reach Height 11.5 mtr / Cap 2 MT Local",
  "Trolley Electric Stacker (Jungheinrich) - Reach Height 5.23 mtr / Cap 1.6 Ton (Model - EJC BB216)",
  "Trolley Electric Stacker (Jungheinrich) - Reach Height 5.43 mtr / Cap 1.6 Ton (Model - ERC BB216)",
  "Trolley Long Fork Power Pallet Truck (Jungheinrich) - Cap 2.0 ton (Model ERE MA120 G240)",
  "Trolley Long Fork Power Pallet Truck (Jungheinrich) - Cap 2.0 ton (Model ERE MB225 G240)",
  "Trolley Reach Truck (Jungheinrich)  -  Reach Height 10.7 mtr / Cap 1.6 Ton (Model - ETV MB216)",
  "Trolley Reach Truck (Jungheinrich) -  Reach Height 11.5 mtr / Cap 2 Ton (Model - ETV MC320)",
  "Trolley Reach Truck (Jungheinrich)  - Reach Height 9 mtr / Cap 1.4 Ton (Model - ETV MB214)",
  "Trolley Tow Truck (Jungheinrich) with Battery & Charger - Cap 3.0 ton (Model - EZS MB230 )",
  "Trolley Tow Truck (Jungheinrich) with Battery & Charger - Cap 5.0 ton (Model - EZS 350 )",
  "UPS 1 KVA - with 30 Minutes backup",
  "UPS 10 KVA - with 15 Minutes backup",
  "UPS 10 KVA - with 30 Minutes backup",
  "UPS 2 KVA - with 30 Minutes backup",
  "UPS 20 KVA - with 30 Minutes backup",
  "UPS 3 KVA - with 30 Minutes backup",
  "UPS 6 KVA - with 30 Minutes backup",
  "Vaccum Cleaner - Air flow 300 CBM / hr + Tank Capacity - 60 ltrs",
  "Warehouse Enclosure - Alluminium board partition",
  "Warehouse Enclosure - Gypsum board partition",
  "Warehouse Enclosure-Meshed partition",
  "Water Cooler - Blue Star - 40 litres",
  "Water Cooler - Blue Star - 80 litres",
  "Water Dispenser Machine - 3 litre",
  "Weighting scale - 1.5 mtr (W) x 1.2 mtr (D) - Cap 1000 kg / LC - 10 gm",
  "Weighting scale - Cap 100 kg / LC - 1 gm",
  "Weighting scale - Cap 15 kg / LC - 0.5 gm",
  "Weighting scale - Cap 15 kg / LC - 1 gm",
  "White board (6'X 4')",
  "Wi-Fi Access point (covering 5,000 sq.ft.)",
  "Wi-Fi Cabling",
  "Work Station - 4' (L) x3' (W) x 3.5' (H)",
  "Work Station - 5' (L) x3' (W) x 3.5' (H)",
  "Xebra Label Printer",
  "ZEBRA GX 420D/200 DPI (Gift pack printer)",
  "ZEBRA GX430T/300 DPI (SLAM Label Printer)"
];

export default function CapexTable({ obfId = "obf1" }: CapexTableProps) {
  const [capexData, setCapexData] = useState<Capex[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCapex, setCurrentCapex] = useState<Capex | null>(null);
  const [formData, setFormData] = useState({
    asset: '',
    asset_description: '',
    category: '',
    period: '',
    amc: '',
    unit_cost: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isAddingNewDescription, setIsAddingNewDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    const fetchCapexData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mastersApi.capex.getByObf(obfId);
        
        // Add sl_no to each item if not present
        const dataWithSlNo = data.map((item: any, index: number) => ({
          ...item,
          sl_no: item.sl_no || index + 1
        }));
        
        setCapexData(dataWithSlNo);
      } catch (err) {
        console.error("Failed to fetch capex data:", err);
        setError(err instanceof Error ? err.message : "Failed to load capex data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCapexData();
  }, [obfId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    if (value === "add_new" && name === "asset_description") {
      setIsAddingNewDescription(true);
      setFormData(prev => ({
        ...prev,
        [name]: ""
      }));
    } else {
      setIsAddingNewDescription(false);
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
      asset_description: value
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const capexEntry = {
        obf_id: obfId,
        sr_no: capexData.length + 1,
        asset: formData.asset,
        asset_description: formData.asset_description,
        category: formData.category,
        period: parseInt(formData.period),
        amc: parseFloat(formData.amc),
        unit_cost: parseFloat(formData.unit_cost)
      };

      const response = await mastersApi.capex.create(capexEntry);
      setCapexData([...capexData, response]);
      setIsAddDialogOpen(false);
      setFormData({
        asset: '',
        asset_description: '',
        category: '',
        period: '',
        amc: '',
        unit_cost: ''
      });
      setIsAddingNewDescription(false);
      setNewDescription("");
    } catch (error) {
      console.error('Error adding capex entry:', error);
    }
  };

  const handleEditClick = (capex: Capex) => {
    setCurrentCapex(capex);
    setFormData({
      asset: capex.asset,
      asset_description: capex.asset_description,
      category: capex.category,
      period: String(capex.period),
      amc: String(capex.amc * 100), // Convert from decimal to percentage for display
      unit_cost: String(capex.unit_cost)
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!currentCapex) return;
    
    try {
      setError(null);
      
      // Validate form
      if (!formData.asset.trim() || !formData.asset_description.trim()) {
        setError("Asset type and description are required.");
        return;
      }
      
      // Update capex entry data
      const capexEntry = {
        obf_id: obfId,
        sr_no: currentCapex.sl_no,
        asset: formData.asset,
        asset_description: formData.asset_description,
        category: formData.category,
        period: formData.period ? parseInt(formData.period) : 0,
        amc: formData.amc ? parseFloat(formData.amc) / 100 : 0,
        unit_cost: formData.unit_cost ? parseFloat(formData.unit_cost) : 0
      };
      
      // Send to API
      await mastersApi.capex.update(currentCapex.id, capexEntry);
      
      // Update local state
      setCapexData(prev => 
        prev.map(item => item.id === currentCapex.id ? {
          ...item,
          ...capexEntry
        } : item)
      );
      
      // Reset form and close dialog
      setCurrentCapex(null);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update capex entry");
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this capex entry?")) {
      try {
        setError(null);
        
        // Send to API
        await mastersApi.capex.delete(id);
        
        // Update local state
        const updatedData = capexData.filter(item => item.id !== id);
        
        // Renumber the entries
        const renumberedData = updatedData.map((item, index) => ({
          ...item,
          sl_no: index + 1
        }));
        
        setCapexData(renumberedData);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to delete capex entry");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading capex data...</div>;
  }

  if (error) {
    return <div className="flex justify-center p-4 text-red-600">Error: {error}</div>;
  }

  // Function to format AMC as percentage
  const formatAmcPercentage = (amc: number): string => {
    return (amc * 100).toFixed(0) + '%';
  };

  return (
    <div>
      <div className="flex justify-end mb-4 w-full">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Capex
            </Button>
          </DialogTrigger>
          <DialogContent className="w-10/12">
            <DialogHeader>
              <DialogTitle>Add Capex Entry</DialogTitle>
              <DialogDescription>
                Add a new capex entry to the master data.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4 w-10/12">
              <div className="space-y-2">
                <Label htmlFor="asset">Asset Type*</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange(value, "asset")}
                  value={formData.asset}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 min-w-fit">
                <Label htmlFor="asset_description">Asset Description*</Label>
                {!isAddingNewDescription ? (
                  <Select
                    onValueChange={(value) => handleSelectChange(value, "asset_description")}
                    value={formData.asset_description}
                  >
                    <SelectTrigger className="min-w-fit">
                      <SelectValue placeholder="Select asset description" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto max-w-[300px]">
                      <SelectItem value="add_new" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add new description
                      </SelectItem>
                      {ASSET_DESCRIPTIONS.map((description) => (
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
                      placeholder="Enter new asset description"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsAddingNewDescription(false);
                        setNewDescription("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
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
                <Label htmlFor="period">Period (years)</Label>
                <Input
                  id="period"
                  name="period"
                  type="number"
                  value={formData.period}
                  onChange={handleInputChange}
                  placeholder="e.g. 5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amc">AMC (%)</Label>
                <Input
                  id="amc"
                  name="amc"
                  type="number"
                  step="0.01"
                  value={formData.amc}
                  onChange={handleInputChange}
                  placeholder="e.g. 5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit_cost">Unit Cost (₹)</Label>
                <Input
                  id="unit_cost"
                  name="unit_cost"
                  type="number"
                  step="0.01"
                  value={formData.unit_cost}
                  onChange={handleInputChange}
                  placeholder="e.g. 50000"
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
          <TableCaption>List of capex entries in the master data.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Sl. No.</TableHead>
              <TableHead>Asset Type</TableHead>
              <TableHead>Asset Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>AMC</TableHead>
              <TableHead>Unit Cost (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {capexData.map((capex) => (
              <TableRow key={capex.id}>
                <TableCell>{capex.sl_no}</TableCell>
                <TableCell>{capex.asset}</TableCell>
                <TableCell>{capex.asset_description}</TableCell>
                <TableCell>{capex.category}</TableCell>
                <TableCell>{capex.period}</TableCell>
                <TableCell>{formatAmcPercentage(capex.amc)}</TableCell>
                <TableCell>{capex.unit_cost.toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(capex)}>
                      <PencilSimple className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(capex.id)}>
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
            <DialogTitle>Edit Capex Entry</DialogTitle>
            <DialogDescription>
              Update the details of this capex entry.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_asset">Asset Type*</Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value, "asset")}
                value={formData.asset}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_asset_description">Asset Description*</Label>
              <Select
                onValueChange={(value) => handleSelectChange(value, "asset_description")}
                value={formData.asset_description}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset description" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add_new" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add new description
                  </SelectItem>
                  {ASSET_DESCRIPTIONS.map((description) => (
                    <SelectItem key={description} value={description}>
                      {description}
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
              <Label htmlFor="edit_period">Period (years)</Label>
              <Input
                id="edit_period"
                name="period"
                type="number"
                value={formData.period}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_amc">AMC (%)</Label>
              <Input
                id="edit_amc"
                name="amc"
                type="number"
                step="0.01"
                value={formData.amc}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_unit_cost">Unit Cost (₹)</Label>
              <Input
                id="edit_unit_cost"
                name="unit_cost"
                type="number"
                step="0.01"
                value={formData.unit_cost}
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