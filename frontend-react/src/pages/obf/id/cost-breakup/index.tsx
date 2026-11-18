import React, { useState, useEffect, forwardRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obfService, OBF, obfBreakupService, RentBreakup, ImplementationCost, PreGoLiveManpower, AdditionalImplementationCost } from '../../../../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { OBFWorkflow } from '../../../../components/OBFWorkflow';
import { Input } from '../../../../components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../components/ui/table';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { mastersApi } from '../../../../lib/api';
import { cn } from '../../../../lib/utils';
import { 
  CaretDown, 
  PersonSimpleWalk, 
  Trash, 
  Users, 
  ChartBar, 
  Receipt, 
  Buildings, 
  ClipboardText, 
  Clock, 
  PlusCircle 
} from "@phosphor-icons/react";
import { toast } from 'sonner';
import { useInView } from 'react-intersection-observer';

interface MasterRental {
  id: string;
  location: string;
  area_sqft: number;
  rent_per_sqft: string;
  sr_no: number;
  created_at: string;
  updated_at: string;
}

export default function CostBreakup() {
  const params = useParams();
  const obfId = params.id as string;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('manpower');
  const [isSaving, setIsSaving] = useState(false);
  const [manpower, setManpower] = useState<any[]>([]);
  const [capex, setCapex] = useState<any[]>([]);
  const [opex, setOpex] = useState<any[]>([]);
  const [rental, setRental] = useState<any[]>([]);
  const [implCosts, setImplCosts] = useState<any[]>([]);
  const [preGoLive, setPreGoLive] = useState<any[]>([]);
  const [additionalCosts, setAdditionalCosts] = useState<any[]>([]);
  const [obf, setObf] = useState<OBF | null>(null);

  // State for master data
  const [masterManpower, setMasterManpower] = useState<any[]>([]);
  const [masterCapex, setMasterCapex] = useState<any[]>([]);
  const [masterOpex, setMasterOpex] = useState<any[]>([]);
  const [masterRental, setMasterRental] = useState<MasterRental[]>([]);
  const [rentalLocations, setRentalLocations] = useState<string[]>([]);

  // Derived dropdown options from master data
  const [roleDescriptions, setRoleDescriptions] = useState<string[]>([]);
  const [mllGrades, setMllGrades] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [rolls, setRolls] = useState<string[]>([]);

  // Full picklist options imported from Masters
  const ROLE_DESCRIPTIONS = [
    "Adhoc Delivery Associates", "Adhoc Enroute Loaders", "Adhoc Loaders", "Adhoc Process Associates", "Adhoc Security Guard",
    "ADM", "Admin Staff (DPO/MIS)", "Admin Staff (skilled)Warehouse", "Aerosol Checkers", "AFL Operator",
    "Area Manager", "Assistant Manager", "Assistant/Deputy Manager", "Associate", "Associate - Operations",
    "Associates( semi-skilled )", "Asst. Manager", "BA - Executive", "BA - Helper", "BA Manpower",
    "BA Supervisor", "BA Supervisor( Shared resource)", "BA-MHE Operator", "BA-Operator", "BA-Picker",
    "BOPT Operator", "Cashier", "Casual Labour (Semi-skilled)", "Casual Manpower for cleaning", "CAT manpower",
    "CCTV Operator", "CCTV Operator/ MST", "Checker & Put away Labour (Skilled)", "Checkers", "CL (Un-Skilled)",
    "Cleaner", "Clerk", "Combi lift", "Commercial Executive", "Computer operators",
    "Control Tower Executive", "Crane operator", "Cross Dock In-charge", "Cross Dock Manpower", "CSD + Water Planner",
    "Cycle count Casual", "Damage Handling-Support", "Data Entry Operator (DEO)", "DC manager", "Delivery Associate",
    "DEO + (MIS + Documentation)", "DEO Co-Packaging", "DEO Cum Supervisor", "DEO/Executive", "DEO/Executive (PCS / GR preparation)",
    "DEO/Executive (Receipt to Dispatch System Operator )", "DEO/Supervisor", "Deputy Manager", "Dock Checker", "Dock Checker in",
    "Dock Checker out", "Dock Marshal", "Dock Security", "Dock-Checker-out", "Documentation", "Driver",
    "Dy Manager (ADM)", "Dy. Manager", "Dy. Manager - HR & Admin", "Electricians", "Enroute Loaders",
    "EOT Operator", "EV Driver", "Excavator Floor in-charge", "Executive - Admin", "Executive - EV Operations",
    "Executive - HR & Admin", "Executive - HR / MIS", "Executive - Operation", "Executive - Operations", "Executive - Vehicle Placement",
    "Executive (Operation Supervisor)", "Executive (Safety- Supervisor)", "Executive- Functional in-charge", "Executive Inventory", "Executive Operation",
    "Executive/Officer", "Executive/Officer-Put Away", "Executive/Sr. Executive -out", "Executives/Supervisor", "Facility Admin",
    "FG in-charge-CPG", "Fixed Das", "Fixed Loaders", "Fixed Security", "FL Operator", "Floor Supervisor", "FLT Operator",
    "Fork Lift Driver (FLD)", "FTC (Operation DEO)", "FTC (Operation Supervisor)", "Gas Cutter", "General Trade Planner",
    "Godrej 1.5T  Stacker , MFH-6000 mm Driver", "Godrej 2 T Articulated forklift truck, MFH-9000 mm Driver", "Grader/ Sorter",
    "Group leader", "Gunman", "Helpers", "Highly Skilled", "HLOP Operator",
    "House Keeping at WH ( Un Skilled )", "House Keeping/Office boy- Sindhu", "Housekeeper",
    "HR", "HR & Admin Executive", "HR / Administration", "HR + Admin", "HR and Safety Executive",
    "HR- Deputy Manager", "HR Executive", "HR in-charge", "HR Lead", "HR Manager", "HR/Admin/Safety Officer",
    "Hub in-charge", "IB Executive", "IB IRN Skilled", "IB Material checking", "IB QC Skilled",
    "IB QC Skilled, IB LBH Skilled", "IB Semi-Skilled", "IB Skilled", "IB Unloader", "IB Unloader and OB Loader",
    "ICQA Executive", "ICQA Supervisor", "ICQA-Semiskilled"
  ];
  const MLL_GRADES = [
    "Assistant Manager", "DEO", "Deputy Manager", "Deputy Manager - 1", "Deputy Manager - 2",
    "Deputy Manager - 3", "Executive", "Executive - 1", "Executive - 2", "Executive - 3",
    "Executive-1", "Interns", "Labour", "Manager", "Manager - 1", "Manager - 2",
    "Manager - 3", "MHE Operator", "MLL Grade", "Security Guard", "Security Supervisor",
    "Semi-Skilled Labour", "Semiskilled-Operators", "Senior Executive", "Senior Executive - 1",
    "Senior Executive - 2", "Senior Executive - 3", "Senior Manager", "Senior Manager - 1",
    "Skilled Labour", "Skilled Operators", "Staff", "Supervisor", "Supervisor - 1",
    "Supervisor - 2", "Supervisor - 3", "Supervisory", "Team Leader", "Un Skilled Labour",
    "Unskilled", "L2DH-AVP", "L3DH-Sr.GM", "L4DH-General Manager", "L5DH-DGM",
    "L5M-AGM", "L6M-Senior Manager", "L7M-Manager", "L7O-Deputy Manager",
    "L8O-Asst. Manager", "L9O-Sr.Executive", "L10O-Executive"
  ];
  const CATEGORIES = ["Management", "Supervisory", "Labour", "Security"];
  const ROLLS = ["MLL", "Contract"];

  // Full picklist options for Capex
  const ASSET_TYPES = [
    "DG", "Printer", "Fan", "AC", "Air curtain", "Aircon", "Trolley", "Water cooler", 
    "Forklift", "Attendance System", "Others", "CCTV", "Cartoon Box", "Cabling", 
    "Computer", "Reach Truck", "Battery", "Fire Alarm", "Fire Extinguisher", 
    "Cleanin Machine", "Flooring", "Ladder", "Inverter", "Telephone", "Locker", 
    "Power Pallet Truck", "Shelving", "Metal detector", "Office set-up", 
    "Order Picker", "Table", "Pallet", "Plastic Bins", "HHD", "Bins", "Television", 
    "Signage", "Smoke Detector", "Cupboard", "Strapping Machine", "Wrapping Machine", 
    "Tow Truck", "UPS", "W/h Enclosure", "Weighting Scale", "Board", "HPT", "Stacker",
    "Lift", "Light", "Canteen", "Dock Leveller", "Curtain", "Refrigerator", "Electrification"
  ];
  
  const ASSET_DESCRIPTIONS = [
    "10 KVA 1 Phase With AMF Panel (Without Installation)",
    "10 KVA 1 Phase With MCP (Without Installation)",
    "10 KVA 3 Phase With AMF Panel (Without Installation)",
    "10 KVA 3 Phase With MCP (Without Installation)",
    "100 KVA 3 Phase With AMF Panel (Without Installation)",
    "100 KVA 3 Phase With MCP (Without Installation)",
    "125 KVA 3 Phase With AMF Panel (Without Installation)",
    "125 KVA 3 Phase With MCP (Without Installation)",
    "15 KVA 1 Phase With AMF Panel (Without Installation)",
    "15 KVA 1 Phase With MCP (Without Installation)",
    "15 KVA 3 Phase With AMF Panel (Without Installation)",
    "15 KVA 3 Phase With MCP (Without Installation)",
    "160 KVA 3 Phase With AMF Panel (Without Installation)",
    "160 KVA 3 Phase With MCP (Without Installation)",
    "20 KVA 1 Phase With AMF Panel (Without Installation)",
    "20 KVA 1 Phase With MCP (Without Installation)",
    "20 KVA 3 Phase With AMF Panel (Without Installation)",
    "20 KVA 3 Phase With MCP (Without Installation)",
    "200 KVA 3 Phase With AMF Panel (Without Installation)",
    "200 KVA 3 Phase With MCP (Without Installation)",
    "25 KVA 3 Phase With AMF Panel (Without Installation)",
    "25 KVA 3 Phase With MCP (Without Installation)",
    "250 KVA 3 Phase With AMF Panel (Without Installation)",
    "250 KVA 3 Phase With MCP (Without Installation)",
    "30 KVA 3 Phase With AMF Panel (Without Installation)",
    "30 KVA 3 Phase With MCP (Without Installation)",
    "35 KVA 3 Phase With AMF Panel (Without Installation)",
    "35 KVA 3 Phase With MCP (Without Installation)",
    "40 KVA 3 Phase With AMF Panel (Without Installation)",
    "40 KVA 3 Phase With MCP (Without Installation)",
    "45 KVA 3 Phase With AMF Panel (Without Installation)",
    "45 KVA 3 Phase With MCP (Without Installation)",
    "4-in-1 (Fax, printer, Scaner & copier) - 1000 copy per day",
    "4-in-1 (Fax, printer, Scaner & copier) - 500 copy per day",
    "4-in-1 (Fax, printer, Scaner & copier) - 5000 copy per day",
    "50 KVA 3 Phase With AMF Panel (Without Installation)",
    "50 KVA 3 Phase With MCP (Without Installation)",
    "58.5 KVA 3 Phase With AMF Panel (Without Installation)",
    "58.5 KVA 3 Phase With MCP (Without Installation)",
    "62.5 KVA 3 Phase With AMF Panel (Without Installation)",
    "62.5 KVA 3 Phase With MCP (Without Installation)",
    "82.5 KVA 3 Phase With AMF Panel (Without Installation)",
    "82.5 KVA 3 Phase With MCP (Without Installation)",
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
    "Articulated Forklift with Battery & Charger + Camera - Reach Height 12.5 mtr / Cap 2.0 Ton (Godrej)",
    "Articulated Forklift with Battery & Charger + Camera - Reach Height 7.5 mtr / Cap 1.4 Ton (Godrej)",
    "Articulated Forklift with Battery & Charger + Camera - Reach Height 9.0 mtr / Cap 1.8 Ton (Godrej)",
    "Attendance System",
    "Bag Sealing Machine",
    "Barcode printer",
    "Barcode scanner (wired)",
    "Breath Analyzer",
    "Bubble Pack machine",
    "Cage Trolley - 650 (L) x 450 (W) x 1000 (H)",
    "Camera system with color monitor for Reach Truck (Godrej)",
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
    "Deep Frezzer - 500 ltr - Temp upto -40 Deg",
    "Desktop computer",
    "Diesel Forklift (Godrej) - Reach Height 3.0 mtr / Cap 5.0 Ton",
    "Diesel Forklift (Godrej) - Reach Height 4.5 mtr / Cap 1.5 Ton",
    "Diesel Forklift (Godrej) - Reach Height 4.5 mtr / Cap 2.0 Ton",
    "Diesel Forklift (Godrej) - Reach Height 4.5 mtr / Cap 3.0 Ton",
    "Digital Camera - 7 Megapixel",
    "Display Boards",
    "Dock Bumpers",
    "Dock Leveller (Maini) - Capacity 5 ton 2.0 mtr (W) x 2.2 mtr (L)",
    "Dock Leveller (Maini) - Capacity 9 ton 2.1 mtr (W) x 2.7 mtr (L)",
    "Dock Shelter",
    "Dock Table & chairs + 4 More Chairs",
    "Dot Matrix printer - EPSON - LQ 1150",
    "Dot Matrix printer - EPSON - LQ 2180",
    "Dot Matrix printer - EPSON - LX 300"
  ];
  
  const CAPEX_CATEGORIES = [
    "Utility", "IT", "HSSE", "MHE", "Facility", "WH Equip", "Packing", 
    "L/UL Equip", "Storage", "Other Equip"
  ];

  const [opexDirty, setOpexDirty] = useState(false);

  // Load OBF data and master data on initial mount
  useEffect(() => {
    async function init() {
      try {
        const { data: obfData } = await obfService.getById(obfId);
        setObf(obfData);
        
        // Fetch global master data
        const masterManpowerData = await mastersApi.manpower.getAll();
        setMasterManpower(masterManpowerData || []);
        
        const masterCapexData = await mastersApi.capex.getAll();
        setMasterCapex(masterCapexData || []);
        
        const masterOpexData = await mastersApi.opex.getAll();
        setMasterOpex(masterOpexData || []);
        
        const masterRentalData = await mastersApi.rental.getAll();
        console.log('Fetched master rental data:', masterRentalData);
        setMasterRental(masterRentalData || []);
        
        // Extract unique locations from master rental data
        if (masterRentalData && masterRentalData.length > 0) {
          const locations = Array.from(new Set(masterRentalData.map((item: MasterRental) => item.location)))
            .filter((location): location is string => Boolean(location))
            .sort();
          console.log('Extracted rental locations:', locations);
          setRentalLocations(locations);
        }
        
        // Extract unique values for dropdown options from master data
        if (masterManpowerData && masterManpowerData.length > 0) {
          const roles = Array.from(new Set(masterManpowerData.map((item: { role_description: string }) => item.role_description)))
                            .filter((item): item is string => Boolean(item))
                            .sort();
          setRoleDescriptions(roles);
          const grades = Array.from(new Set(masterManpowerData.map((item: { mll_grade: string }) => item.mll_grade)))
                              .filter((item): item is string => Boolean(item))
                              .sort();
          setMllGrades(grades);
          const cats = Array.from(new Set(masterManpowerData.map((item: { category: string }) => item.category)))
                            .filter((item): item is string => Boolean(item))
                            .sort();
          setCategories(cats);
          const rollTypes = Array.from(new Set(masterManpowerData.map((item: { roll: string }) => item.roll)))
                                 .filter((item): item is string => Boolean(item))
                                 .sort();
          setRolls(rollTypes);
        }
      } catch (error) {
        console.error("Error loading OBF data:", error);
        toast.error("Error loading data");
      }
    }
    init();
  }, [obfId]);

  // Add refs for each section
  const [manpowerRef, manpowerInView] = useInView({ threshold: 0.1 });
  const [capexRef, capexInView] = useInView({ threshold: 0.1 });
  const [opexRef, opexInView] = useInView({ threshold: 0.1 });
  const [rentalRef, rentalInView] = useInView({ threshold: 0.1 });
  const [implCostRef, implCostInView] = useInView({ threshold: 0.1 });
  const [preGoLiveRef, preGoLiveInView] = useInView({ threshold: 0.1 });
  const [additionalCostRef, additionalCostInView] = useInView({ threshold: 0.1 });

  // Modify the loadTabData function to handle lazy loading
  const loadTabData = async () => {
    try {
      setLoading(true);
      console.log('Loading tab data for OBF:', obfId);
      
      const fetchPromises = [];
      
      if (manpowerInView && manpower.length === 0) {
        console.log('Fetching manpower data...');
        fetchPromises.push(obfBreakupService.getManpowerBreakup(obfId).then((res) => {
          console.log('Manpower data received:', res.data);
          if (res.data) {
            const manpowerData = Array.isArray(res.data) ? res.data : [res.data];
            setManpower(manpowerData);
          }
        }));
      }
      
      if (capexInView && capex.length === 0) {
        console.log('Fetching capex data...');
        fetchPromises.push(obfBreakupService.getCapexBreakup(obfId).then((res) => {
          console.log('Capex data received:', res.data);
          if (res.data) {
            const capexData = Array.isArray(res.data) ? res.data : [res.data];
            setCapex(capexData);
          }
        }));
      }
      
      if (opexInView && opex.length === 0) {
        console.log('Fetching opex data...');
        fetchPromises.push(obfBreakupService.getOpexBreakup(obfId).then((res) => {
          console.log('Opex data received:', res.data);
          if (res.data) {
            const opexData = Array.isArray(res.data) ? res.data : [res.data];
            setOpex(opexData);
          }
        }));
      }
      
      if (rentalInView && rental.length === 0) {
        console.log('Fetching rental data...');
        fetchPromises.push(obfBreakupService.getRentBreakup(obfId).then((res) => {
          console.log('Rental data received:', res.data);
          if (res.data) {
            const rentalData = Array.isArray(res.data) ? res.data : [res.data];
            setRental(rentalData);
          }
        }));
      }
      
      if (implCostInView && implCosts.length === 0) {
        console.log('Fetching implementation cost data...');
        fetchPromises.push(obfBreakupService.getImplementationCost(obfId).then((res) => {
          console.log('Implementation cost data received:', res.data);
          if (res.data) {
            const implCostData = Array.isArray(res.data) ? res.data : [res.data];
            setImplCosts(implCostData);
          }
        }));
      }
      
      if (preGoLiveInView && preGoLive.length === 0) {
        console.log('Fetching pre-go-live manpower data...');
        fetchPromises.push(obfBreakupService.getPreGoLiveManpower(obfId).then((res) => {
          console.log('Pre-go-live manpower data received:', res.data);
          if (res.data) {
            const preGoLiveData = Array.isArray(res.data) ? res.data : [res.data];
            setPreGoLive(preGoLiveData);
          }
        }));
      }
      
      if (additionalCostInView && additionalCosts.length === 0) {
        console.log('Fetching additional implementation cost data...');
        fetchPromises.push(obfBreakupService.getAdditionalImplementationCost(obfId).then((res) => {
          console.log('Additional implementation cost data received:', res.data);
          if (res.data) {
            const additionalCostData = Array.isArray(res.data) ? res.data : [res.data];
            setAdditionalCosts(additionalCostData);
          }
        }));
      }

      await Promise.all(fetchPromises);
      console.log('All data loaded successfully');
    } catch (error) {
      console.error("Error loading tab data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Add effect to reload data when sections come into view
  useEffect(() => {
    console.log('View conditions:', {
      manpowerInView,
      capexInView,
      opexInView,
      rentalInView,
      implCostInView,
      preGoLiveInView,
      additionalCostInView,
      manpowerLength: manpower.length,
      capexLength: capex.length,
      opexLength: opex.length,
      rentalLength: rental.length,
      implCostsLength: implCosts.length,
      preGoLiveLength: preGoLive.length,
      additionalCostsLength: additionalCosts.length
    });
    
    if (manpowerInView || capexInView || opexInView || rentalInView || 
        implCostInView || preGoLiveInView || additionalCostInView) {
      loadTabData();
    }
  }, [manpowerInView, capexInView, opexInView, rentalInView, 
      implCostInView, preGoLiveInView, additionalCostInView]);

  const update = (setter: Function, index: number, field: string, value: any) => {
    setter((prevArr: any[]) => prevArr.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const totalAmount = (arr: any[], field: string) => {
    const total = arr.reduce((s, item) => s + ((item[field] ?? 0) * (item.nos ?? 0)), 0);
    return total.toFixed(2);
  };

  // Handlers to add new rows
  const addManpower = () => {
    // Find the maximum sr_no among existing records
    const maxSrNo = manpower.length > 0 ? Math.max(...manpower.map(item => item.sr_no || 0)) : 0;
    // Add a new record with sr_no one higher than the maximum
    setManpower(prev => [...prev, { 
      obf_id: obfId, 
      sr_no: maxSrNo + 1, 
      role_description: '', 
      mll_grade: '', 
      category: '', 
      roll: '', 
      ctc: 0, 
      nos: 0,
      master_id: null
    }]);
  };
  
  const addCapex = () => {
    const maxSrNo = capex.length > 0 ? Math.max(...capex.map(item => item.sr_no || 0)) : 0;
    setCapex(prev => [...prev, { 
      obf_id: obfId, 
      sr_no: maxSrNo + 1, 
      asset: '', 
      asset_description: '', 
      category: '', 
      period: 0, 
      amc: 0, 
      unit_cost: 0, 
      nos: 0,
      master_id: null
    }]);
  };
  
  const addOpex = () => {
    const maxSrNo = opex.length > 0 ? Math.max(...opex.map(item => item.sr_no || 0)) : 0;
    const firstDescription = masterOpex.length > 0 ? masterOpex[0].cost_description : '';
    setOpex(prev => [...prev, { 
      obf_id: obfId, 
      sr_no: maxSrNo + 1, 
      cost_description: firstDescription, 
      unit_cost_per_month: 0, 
      nos: 0,
      master_id: null
    }]);
  };
  
  const addRent = () => {
    setRental(prev => {
      const currentRental = Array.isArray(prev) ? prev : [];
      return [...currentRental, {
        obf_id: obfId,
        built_up_to_carpet_ratio: 0,
        rent_per_sqft_on_built_up: 0,
        built_up_area_sqft: 0,
        building_maintenance: 0,
        warai_charges: 0,
        interest_on_security_deposit: 0,
        security_deposit: 0,
        brokerage: 0,
        pre_go_live_rental: 0,
        stamp_duty_amount: 0,
        registration_amount: 0,
        location: '',
        area: 0,
        master_id: null
      }];
    });
  };
  const addImplCost = () => setImplCosts(prev => [...prev, { obf_id: obfId, cost_type: '', unit_cost: 0, nos: 0 }]);

  // Add a function to add Pre Go Live Manpower entries
  const addPreGoLive = () => {
    // Find the maximum sr_no among existing records, or use 0 if no records exist
    const maxSrNo = preGoLive.length > 0 ? Math.max(...preGoLive.map(item => item.sr_no || 0)) : 0;
    // Add a new record
    setPreGoLive(prev => [...prev, { 
      obf_id: obfId, 
      sr_no: maxSrNo + 1,
      manpower_type: '', 
      nos: 0,
      cost_per_month: 0
    }]);
  };

  const handleRoleDescriptionChange = (index: number, value: string) => {
    // Update role description
    update(setManpower, index, 'role_description', value);
    
    // Find matching master record
    const masterRecord = masterManpower.find(item => item.role_description === value);
    
    if (masterRecord) {
      // Store the master ID
      update(setManpower, index, 'master_id', masterRecord.id);
      
      // Auto-populate fields from master record
      update(setManpower, index, 'mll_grade', masterRecord.mll_grade ?? '');
      update(setManpower, index, 'category', masterRecord.category ?? '');
      update(setManpower, index, 'roll', masterRecord.roll ?? '');
      update(setManpower, index, 'ctc', masterRecord.ctc ?? 0);
    }
  };

  const handleCapexAssetTypeChange = (index: number, value: string) => {
    console.log("handleCapexAssetTypeChange called with:", index, value); // Debug log
    
    // Create a new array with the updated item to ensure state changes are detected
    const updatedCapex = [...capex];
    updatedCapex[index] = {
      ...updatedCapex[index],
      asset: value,
      asset_description: '',
      category: '',
      period: 0,
      amc: 0,
      unit_cost: 0
    };
    
    // Update the state with the new array
    setCapex(updatedCapex);
  };

  const handleCapexAssetDescriptionChange = (index: number, value: string) => {
    console.log("handleCapexAssetDescriptionChange called with:", index, value); // Debug log
    
    // Create a new array with the updated item
    const updatedCapex = [...capex];
    updatedCapex[index] = {
      ...updatedCapex[index],
      asset_description: value,
      category: '',
      period: 0,
      amc: 0,
      unit_cost: 0
    };
    
    // Update the state with the new array
    setCapex(updatedCapex);
  };

  const handleCapexCategoryChange = (index: number, value: string) => {
    console.log("handleCapexCategoryChange called with:", index, value); // Debug log
    
    // Update category
    const updatedCapex = [...capex];
    updatedCapex[index] = {
      ...updatedCapex[index],
      category: value
    };
    
    const assetType = updatedCapex[index].asset;
    const assetDescription = updatedCapex[index].asset_description;
    
    // Now that we have all three values, look for exact match in global capex table
    if (assetType && assetDescription && value) {
      // Find the matching record in masterCapex that has the same asset type, description, and category
      const exactMatch = masterCapex.find(
        item => item.asset === assetType && 
               item.asset_description === assetDescription && 
               item.category === value
      );
      
      if (exactMatch) {
        // Auto-populate fields from the matching record
        updatedCapex[index] = {
          ...updatedCapex[index],
          period: exactMatch.period ?? 0,
          amc: exactMatch.amc ?? 0,
          unit_cost: exactMatch.unit_cost ?? 0,
          master_id: exactMatch.id || null
        };
      }
    }
    
    // Update the state with the new array
    setCapex(updatedCapex);
  };

  const handleOpexDescriptionChange = (index: number, value: string) => {
    setOpexDirty(true);
    update(setOpex, index, 'cost_description', value);
    // Find matching master record
    const masterRecord = masterOpex.find(item => item.cost_description === value);
    if (masterRecord) {
      update(setOpex, index, 'master_id', masterRecord.id);
      update(setOpex, index, 'unit_cost_per_month', masterRecord.unit_cost ?? 0);
    }
  };

  // Add this debug log at the start of the component to verify master data
  useEffect(() => {
    console.log('Master Rental Data:', masterRental);
  }, [masterRental]);

  const handleRentalLocationChange = (index: number, location: string) => {
    try {
      const masterRecord = masterRental.find(record => record.location === location);
      if (masterRecord) {
        setRental(prevRental => {
          const newRental = [...prevRental];
          const currentRental = newRental[index] || {};
          newRental[index] = {
            ...currentRental,
            location,
            master_id: masterRecord.id,
            area: masterRecord.area_sqft || 0,
            rent_per_sqft_on_built_up: parseFloat(masterRecord.rent_per_sqft) || 0
          };
          return newRental;
        });
        toast.success('Location data populated from master record');
      } else {
        setRental(prevRental => {
          const newRental = [...prevRental];
          const currentRental = newRental[index] || {};
          newRental[index] = {
            ...currentRental,
            location,
            rent_per_sqft_on_built_up: 0
          };
          return newRental;
        });
        toast.error('No master record found for selected location');
      }
    } catch (error) {
      console.error('Error updating rental location:', error);
      toast.error('Failed to update rental location');
    }
  };

  // Replace the CSS injection with stronger rules
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Force scrollable dropdown */
      [data-radix-popper-content-wrapper] {
        --radix-select-content-available-height: 20rem !important;
        max-height: 20rem !important;
        overflow-y: auto !important;
      }
      
      [data-slot="select-content"] {
        max-height: 20rem !important;
        overflow-y: auto !important;
      }
      
      /* Override any other styles that might prevent scrolling */
      [data-radix-popper-content-wrapper] [data-slot="select-content"] [data-radix-scroll-area-viewport] {
        max-height: 20rem !important;
        overflow-y: auto !important;
      }
      
      /* Make sure the viewport allows scrolling */
      [data-radix-select-viewport] {
        max-height: 20rem !important;
        overflow-y: auto !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const operations = [];

      // Save manpower data
      if (manpower.length > 0) {
        operations.push(saveManpower());
      }

      // Save capex data
      if (capex.length > 0) {
        operations.push(saveCapex());
      }

      // Save opex data
      if (opex.length > 0) {
        operations.push(saveOpex());
      }

      // Save rental data
      if (rental.length > 0) {
        operations.push(saveRental());
      }

      // Save implementation cost data
      if (implCosts.length > 0) {
        operations.push(saveImplCost());
      }

      // Save pre go-live manpower data
      if (preGoLive.length > 0) {
        operations.push(savePreGoLive());
      }

      // Save additional implementation cost data
      if (additionalCosts.length > 0) {
        operations.push(saveAdditionalCost());
      }

      await Promise.all(operations);
      toast.success("All data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data");
    } finally {
      setIsSaving(false);
    }
  };

  // Add delete functions for each type of data
  const deleteManpower = (index: number) => {
    const newManpower = [...manpower];
    newManpower.splice(index, 1);
    setManpower(newManpower);
  };

  const deleteCapex = (index: number) => {
    const newCapex = [...capex];
    newCapex.splice(index, 1);
    setCapex(newCapex);
  };

  const deleteOpex = (index: number) => {
    const newOpex = [...opex];
    newOpex.splice(index, 1);
    setOpex(newOpex);
  };

  const deleteRental = (index: number) => {
    const newRental = [...rental];
    newRental.splice(index, 1);
    setRental(newRental);
  };

  const deleteImplCost = (index: number) => {
    const newImplCosts = [...implCosts];
    newImplCosts.splice(index, 1);
    setImplCosts(newImplCosts);
  };

  const deletePreGoLive = (index: number) => {
    const newPreGoLive = [...preGoLive];
    newPreGoLive.splice(index, 1);
    setPreGoLive(newPreGoLive);
  };

  const deleteAdditionalCost = (index: number) => {
    const newAdditionalCosts = [...additionalCosts];
    newAdditionalCosts.splice(index, 1);
    setAdditionalCosts(newAdditionalCosts);
  };

  // Rental breakup
  const handleRentalUpdate = async (id: string, data: RentBreakup) => {
    try {
      await obfBreakupService.updateRentalBreakup(id, data);
      await loadTabData();
    } catch (error) {
      console.error('Error updating rental:', error);
      toast.error('Failed to update rental');
    }
  };

  // Implementation cost breakup
  const handleImplementationCostUpdate = async (id: string, data: ImplementationCost) => {
    try {
      await obfBreakupService.updateImplementationCost(id, data);
      await loadTabData();
    } catch (error) {
      console.error('Error updating implementation cost:', error);
      toast.error('Failed to update implementation cost');
    }
  };

  // Pre go live manpower breakup
  const handlePreGoLiveManpowerUpdate = async (id: string, data: PreGoLiveManpower) => {
    try {
      await obfBreakupService.updatePreGoLiveManpower(id, data);
      await loadTabData();
    } catch (error) {
      console.error('Error updating pre go live manpower:', error);
      toast.error('Failed to update pre go live manpower');
    }
  };

  // Additional implementation cost breakup
  const handleAdditionalImplementationCostUpdate = async (id: string, data: AdditionalImplementationCost) => {
    try {
      await obfBreakupService.updateAdditionalImplementationCost(id, data);
      await loadTabData();
    } catch (error) {
      console.error('Error updating additional implementation cost:', error);
      toast.error('Failed to update additional implementation cost');
    }
  };

  // Add these new save handlers before the return statement in the main component
  const saveManpower = async () => {
    try {
      setIsSaving(true);
      
      // Send all records in a single POST request
      await obfBreakupService.createManpowerBreakup(
        manpower.map(record => ({
          ...record,
          obf_id: obfId
        }))
      );

      await loadTabData();
      toast.success("Manpower data saved successfully");
    } catch (error) {
      console.error("Error saving manpower data:", error);
      toast.error("Failed to save manpower data");
    } finally {
      setIsSaving(false);
    }
  };

  const saveCapex = async () => {
    try {
      setIsSaving(true);
      await obfBreakupService.createCapexBreakup(capex.map(record => ({ ...record, obf_id: obfId })));
      toast.success("Capex data saved successfully");
    } catch (error) {
      console.error("Error saving capex data:", error);
      toast.error("Failed to save capex data");
    } finally {
      setIsSaving(false);
    }
  };

  const saveOpex = async () => {
    try {
      setIsSaving(true);
      await obfBreakupService.createOpexBreakup(opex.map(record => ({ ...record, obf_id: obfId })));
      toast.success("Opex data saved successfully");
    } catch (error) {
      console.error("Error saving opex data:", error);
      toast.error("Failed to save opex data");
    } finally {
      setIsSaving(false);
    }
  };

  const saveRental = async () => {
    try {
      setIsSaving(true);
      const rentalToSend = rental.map((r: any) => ({
        obf_id: obfId,
        built_up_to_carpet_ratio: r.built_up_to_carpet_ratio ?? 0,
        rent_per_sqft_on_built_up: r.rent_per_sqft_on_built_up ?? 0,
        built_up_area_sqft: r.built_up_area_sqft ?? 0,
        building_maintenance: r.building_maintenance ?? 0,
        warai_charges: r.warai_charges ?? 0,
        interest_on_security_deposit: r.interest_on_security_deposit ?? 0,
        security_deposit: r.security_deposit ?? 0,
        brokerage: r.brokerage ?? 0,
        pre_go_live_rental: r.pre_go_live_rental ?? 0,
        stamp_duty_amount: r.stamp_duty_amount ?? 0,
        registration_amount: r.registration_amount ?? 0,
        master_id: r.master_id || null,
        location: r.location || '',
        area: r.area ?? 0
      }));
      console.log("Sending rental data:", rentalToSend);
      await obfBreakupService.createRentalBreakup(rentalToSend);
      toast.success("Rental data saved successfully");
    } catch (error) {
      console.error("Error saving rental data:", error);
      toast.error("Failed to save rental data");
    } finally {
      setIsSaving(false);
    }
  };

  const saveImplCost = async () => {
    try {
      setIsSaving(true);
      await obfBreakupService.createImplementationCost(implCosts.map(record => ({ ...record, obf_id: obfId })));
      toast.success("Implementation cost data saved successfully");
    } catch (error) {
      console.error("Error saving implementation cost data:", error);
      toast.error("Failed to save implementation cost data");
    } finally {
      setIsSaving(false);
    }
  };

  const savePreGoLive = async () => {
    try {
      setIsSaving(true);
      await obfBreakupService.createPreGoLiveManpower(preGoLive.map(record => ({ ...record, obf_id: obfId })));
      toast.success("Pre-go-live manpower data saved successfully");
    } catch (error) {
      console.error("Error saving pre-go-live manpower data:", error);
      toast.error("Failed to save pre-go-live manpower data");
    } finally {
      setIsSaving(false);
    }
  };

  const saveAdditionalCost = async () => {
    try {
      setIsSaving(true);
      await obfBreakupService.createAdditionalImplementationCost(additionalCosts.map(record => ({ ...record, obf_id: obfId })));
      toast.success("Additional cost data saved successfully");
    } catch (error) {
      console.error("Error saving additional cost data:", error);
      toast.error("Failed to save additional cost data");
    } finally {
      setIsSaving(false);
    }
  };

  if (!obf) return (
    <OBFWorkflow id={obfId} currentStep="cost-breakup">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <div className="mt-4 text-lg text-gray-500">Loading...</div>
      </div>
    </OBFWorkflow>
  );

  return (
    <OBFWorkflow id={obfId} currentStep="cost-breakup">
      <Card className="mx-auto shadow-md max-w-[82.5vw]">
        <CardHeader className="border-b pb-4 mb-4">
          <CardTitle className="text-2xl font-bold">Cost Breakup</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {obf!.project_name} ({obf!.project_code})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-4">
              <TabsTrigger value="manpower" className="flex items-center gap-2">
                <Users size={20} weight="duotone" />
                Manpower
              </TabsTrigger>
              <TabsTrigger value="capex" className="flex items-center gap-2">
                <ChartBar size={20} weight="duotone" />
                Capex
              </TabsTrigger>
              <TabsTrigger value="opex" className="flex items-center gap-2">
                <Receipt size={20} weight="duotone" />
                Opex
              </TabsTrigger>
              <TabsTrigger value="rental" className="flex items-center gap-2">
                <Buildings size={20} weight="duotone" />
                Rental
              </TabsTrigger>
              <TabsTrigger value="implementation" className="flex items-center gap-2">
                <ClipboardText size={20} weight="duotone" />
                Implementation
              </TabsTrigger>
              <TabsTrigger value="pre-go-live" className="flex items-center gap-2">
                <Clock size={20} weight="duotone" />
                Pre Go Live
              </TabsTrigger>
              <TabsTrigger value="additional" className="flex items-center gap-2">
                <PlusCircle size={20} weight="duotone" />
                Additional
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manpower">
              <Section 
                ref={manpowerRef}
                title="Manpower" 
                icon={<Users size={24} weight="duotone" className="mr-2" />}
                data={manpower} 
                cols={[
                  { label: 'Sl No', render: (row: any) => row.sr_no },
                  { label: 'Role Description', render: (row: any, i: number) => <Select 
                      value={row.role_description ?? ''} 
                      onValueChange={(v: string) => update(setManpower, i, 'role_description', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleDescriptions.length > 0 ? 
                          roleDescriptions.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          )) :
                          ROLE_DESCRIPTIONS.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select> },
                  { label: 'MLL Grade', render: (row: any, i: number) => <Select 
                      value={row.mll_grade ?? ''} 
                      onValueChange={(v: string) => update(setManpower, i, 'mll_grade', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select MLL grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {mllGrades.length > 0 ? 
                          mllGrades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          )) :
                          MLL_GRADES.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select> },
                  { label: 'Category', render: (row: any, i: number) => <Select 
                      value={row.category ?? ''} 
                      onValueChange={(v: string) => update(setManpower, i, 'category', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length > 0 ? 
                          categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          )) :
                          CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select> },
                  { label: 'Roll', render: (row: any, i: number) => <Select 
                      value={row.roll ?? ''} 
                      onValueChange={(v: string) => update(setManpower, i, 'roll', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select roll" />
                      </SelectTrigger>
                      <SelectContent>
                        {rolls.length > 0 ? 
                          rolls.map((roll) => (
                            <SelectItem key={roll} value={roll}>
                              {roll}
                            </SelectItem>
                          )) :
                          ROLLS.map((roll) => (
                            <SelectItem key={roll} value={roll}>
                              {roll}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select> },
                  { label: 'CTC', render: (row: any, i: number) => <InputNumber value={row.ctc ?? 0} onChange={(v: number) => update(setManpower, i, 'ctc', v)} /> },
                  { label: 'Nos.', render: (row: any, i: number) => <InputNumber value={row.nos ?? 0} onChange={(v: number) => update(setManpower, i, 'nos', v)} /> },
                  { label: 'Amount', render: (row: any) => Number((row.ctc ?? 0) * (row.nos ?? 0)).toFixed(2) },
                  { label: '', render: (row: any, i: number) => (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteManpower(i)} 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash size={18} weight="bold" />
                      </Button>
                    )
                  }
                ]} 
                onAdd={addManpower} 
                onSave={saveManpower}
                isSaving={isSaving}
              />
            </TabsContent>

            <TabsContent value="capex">
              <Section 
                ref={capexRef}
                title="Capex" 
                icon={<ChartBar size={24} weight="duotone" className="mr-2" />}
                data={capex} 
                cols={[
                  { label: 'Sl No', render: (r: any) => r.sr_no },
                  { label: 'Asset Type', render: (r: any, i: number) => (
                    <Select 
                      value={r.asset ?? ''} 
                      onValueChange={(value) => {
                        console.log("Asset type selected:", value);  // Debug log
                        handleCapexAssetTypeChange(i, value);
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(new Set(masterCapex.map(item => item.asset)))
                          .filter(Boolean)
                          .sort()
                          .map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  )},
                  { label: 'Asset Description', render: (r: any, i: number) => {
                    // Filter descriptions based on selected asset type
                    const filteredDescriptions = r.asset 
                      ? Array.from(new Set(
                          masterCapex
                            .filter(item => item.asset === r.asset)
                            .map(item => item.asset_description)
                        ))
                          .filter(Boolean)
                          .sort()
                      : [];
                    
                    return (
                      <Select 
                        value={r.asset_description ?? ''}
                        onValueChange={(value) => handleCapexAssetDescriptionChange(i, value)}
                        disabled={!r.asset}
                      >
                        <SelectTrigger className="w-64 truncate">
                          <SelectValue placeholder={r.asset ? "Select description" : "Select asset type first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredDescriptions.length > 0 ? (
                            filteredDescriptions.map(desc => (
                              <SelectItem key={desc} value={desc}>
                                <div className="truncate max-w-[350px]">{desc}</div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-gray-500">
                              {r.asset ? "No descriptions available" : "Select asset type first"}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    );
                  }},
                  { label: 'Category', render: (r: any, i: number) => {
                    // Filter categories based on selected asset type and description
                    const filteredCategories = (r.asset && r.asset_description)
                      ? Array.from(new Set(
                          masterCapex
                            .filter(item => 
                              item.asset === r.asset && 
                              item.asset_description === r.asset_description
                            )
                            .map(item => item.category)
                        ))
                          .filter(Boolean)
                          .sort()
                      : [];
                    
                    return (
                      <Select 
                        value={r.category ?? ''} 
                        onValueChange={(value) => handleCapexCategoryChange(i, value)}
                        disabled={!r.asset || !r.asset_description}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder={!r.asset || !r.asset_description ? "Complete previous fields" : "Select category"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-gray-500">
                              {r.asset && r.asset_description ? "No categories available" : "Complete previous fields"}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    );
                  }},
                  { label: 'Period', render: (r: any, i: number) => 
                    <InputNumber 
                      value={r.period ?? 0} 
                      onChange={(v: number) => update(setCapex, i, 'period', v)} 
                      className="w-20"
                    /> 
                  },
                  { label: 'AMC (%)', render: (r: any, i: number) => 
                    <InputPercent 
                      value={r.amc ?? 0} 
                      onChange={(v: number) => update(setCapex, i, 'amc', v)} 
                    /> 
                  },
                  { label: 'Unit Cost', render: (r: any, i: number) => 
                    <InputNumber 
                      value={r.unit_cost ?? 0} 
                      onChange={(v: number) => update(setCapex, i, 'unit_cost', v)} 
                      className="w-28"
                    /> 
                  },
                  { label: 'Nos.', render: (r: any, i: number) => <InputNumber value={r.nos ?? 0} onChange={(v: number) => update(setCapex, i, 'nos', v)} /> },
                  { label: 'Amount', render: (r: any) => Number((r.unit_cost ?? 0) * (r.nos ?? 0)).toFixed(2) },
                  { label: '', render: (r: any, i: number) => (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteCapex(i)} 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash size={18} weight="bold" />
                      </Button>
                    )
                  }
                ]} 
                onAdd={addCapex} 
                onSave={saveCapex}
                isSaving={isSaving}
              />
            </TabsContent>

            <TabsContent value="opex">
              <Section 
                ref={opexRef}
                title="Opex" 
                icon={<Receipt size={24} weight="duotone" className="mr-2" />}
                data={opex} 
                cols={[
                  { label: 'Sl No', render: (r: any) => r.sr_no },
                  { label: 'Cost Description', render: (r: any, i: number) => {
                    console.log('Rendering Opex row:', r.sr_no, r.cost_description);
                    return (
                      <Select 
                        value={String(r.cost_description ?? '')} 
                        onValueChange={(value) => handleOpexDescriptionChange(i, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select description" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(masterOpex.map(item => item.cost_description)))
                            .filter(Boolean)
                            .sort()
                            .map(desc => (
                              <SelectItem key={desc} value={String(desc)}>{desc}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    );
                  } },
                  { label: 'Unit Cost/month', render: (r: any, i: number) => <InputNumber value={r.unit_cost_per_month ?? 0} onChange={(v: number) => { setOpexDirty(true); update(setOpex, i, 'unit_cost_per_month', v); }} /> },
                  { label: 'Nos.', render: (r: any, i: number) => <InputNumber value={r.nos ?? 0} onChange={(v: number) => { setOpexDirty(true); update(setOpex, i, 'nos', v); }} /> },
                  { label: 'Amount', render: (r: any) => Number((r.unit_cost_per_month ?? 0) * (r.nos ?? 0)).toFixed(2) },
                  { label: '', render: (r: any, i: number) => (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteOpex(i)} 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash size={18} weight="bold" />
                      </Button>
                    )
                  }
                ]} 
                onAdd={addOpex} 
                onSave={saveOpex}
                isSaving={isSaving}
              />
            </TabsContent>

            <TabsContent value="rental">
              <Section 
                ref={rentalRef}
                title="Rental" 
                icon={<Buildings size={24} weight="duotone" className="mr-2" />}
                data={rental} 
                cols={[
                  { label: 'Location', render: (r: any, i: number) => (
                    <Select 
                      value={r.location || ''} 
                      onValueChange={(value) => handleRentalLocationChange(i, value)}
                      defaultValue=""
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {rentalLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )},
                  { label: 'Area', render: (r: any, i: number) => <InputNumber value={r.area ?? 0} onChange={(v: number) => update(setRental, i, 'area', v)} /> },
                  { label: 'Rent / sq.ft. on Built-up', render: (r: any, i: number) => <InputNumber value={r.rent_per_sqft_on_built_up ?? 0} onChange={(v: number) => update(setRental, i, 'rent_per_sqft_on_built_up', v)} /> },
                  { label: 'Built-up to Carpet Ratio (%)', render: (r: any, i: number) => <InputNumber value={r.built_up_to_carpet_ratio ?? 0} onChange={(v: number) => update(setRental, i, 'built_up_to_carpet_ratio', v)} /> },
                  { label: 'Built-up Area (sq.ft.)', render: (r: any, i: number) => <InputNumber value={r.built_up_area_sqft ?? 0} onChange={(v: number) => update(setRental, i, 'built_up_area_sqft', v)} /> },
                  { label: 'Building Maintenance', render: (r: any, i: number) => <InputNumber value={r.building_maintenance ?? 0} onChange={(v: number) => update(setRental, i, 'building_maintenance', v)} /> },
                  { label: 'Warai Charges', render: (r: any, i: number) => <InputNumber value={r.warai_charges ?? 0} onChange={(v: number) => update(setRental, i, 'warai_charges', v)} /> },
                  { label: 'Interest on Security Deposit', render: (r: any, i: number) => <InputNumber value={r.interest_on_security_deposit ?? 0} onChange={(v: number) => update(setRental, i, 'interest_on_security_deposit', v)} /> },
                  { label: 'Security Deposit', render: (r: any, i: number) => <InputNumber value={r.security_deposit ?? 0} onChange={(v: number) => update(setRental, i, 'security_deposit', v)} /> },
                  { label: 'Brokerage', render: (r: any, i: number) => <InputNumber value={r.brokerage ?? 0} onChange={(v: number) => update(setRental, i, 'brokerage', v)} /> },
                  { label: 'Pre Go Live Rental', render: (r: any, i: number) => <InputNumber value={r.pre_go_live_rental ?? 0} onChange={(v: number) => update(setRental, i, 'pre_go_live_rental', v)} /> },
                  { label: 'Stamp Duty Amount', render: (r: any, i: number) => <InputNumber value={r.stamp_duty_amount ?? 0} onChange={(v: number) => update(setRental, i, 'stamp_duty_amount', v)} /> },
                  { label: 'Registration Amount', render: (r: any, i: number) => <InputNumber value={r.registration_amount ?? 0} onChange={(v: number) => update(setRental, i, 'registration_amount', v)} /> },
                  { label: '', render: (r: any, i: number) => (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteRental(i)} 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash size={18} weight="bold" />
                      </Button>
                    )
                  }
                ]} 
                onAdd={addRent} 
                onSave={saveRental}
                isSaving={isSaving}
              />
            </TabsContent>

            <TabsContent value="implementation">
              <Section 
                ref={implCostRef}
                title="Project Implementation Cost" 
                icon={<ClipboardText size={24} weight="duotone" className="mr-2" />}
                data={implCosts} 
                cols={[
                  { label: 'Implementation Cost Break-up', render: (r: any, i: number) => <Input value={r.cost_type ?? ''} onChange={e => update(setImplCosts, i, 'cost_type', e.target.value)} className="w-full" /> },
                  { label: 'Unit Cost', render: (r: any, i: number) => <InputNumber value={r.unit_cost ?? 0} onChange={(v: number) => update(setImplCosts, i, 'unit_cost', v)} /> },
                  { label: 'Nos.', render: (r: any, i: number) => <InputNumber value={r.nos ?? 0} onChange={(v: number) => update(setImplCosts, i, 'nos', v)} /> },
                  { label: 'Amount', render: (r: any) => Number((r.unit_cost ?? 0) * (r.nos ?? 0)).toFixed(2) },
                  { label: '', render: (r: any, i: number) => (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteImplCost(i)} 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash size={18} weight="bold" />
                      </Button>
                    )
                  }
                ]} 
                onAdd={addImplCost}
                onSave={saveImplCost}
                isSaving={isSaving}
              />
            </TabsContent>

            <TabsContent value="pre-go-live">
              <Section 
                ref={preGoLiveRef}
                title="Pre Go Live Manpower cost" 
                icon={<Clock size={24} weight="duotone" className="mr-2" />}
                data={preGoLive} 
                cols={[
                  { label: 'Type', render: (r: any, i: number) => (
                    <Input 
                      value={r.manpower_type ?? ''}
                      onChange={(e) => update(setPreGoLive, i, 'manpower_type', e.target.value)}
                      className="w-full"
                    />
                  )},
                  { label: 'Nos.', render: (r: any, i: number) => <InputNumber value={r.nos ?? 0} onChange={(v: number) => update(setPreGoLive, i, 'nos', v)} /> },
                  { label: 'Cost per Month', render: (r: any, i: number) => <InputNumber value={r.cost_per_month ?? 0} onChange={(v: number) => update(setPreGoLive, i, 'cost_per_month', v)} /> },
                  { label: 'Amount', render: (r: any) => Number((r.nos ?? 0) * (r.cost_per_month ?? 0)).toFixed(2) },
                  { label: '', render: (r: any, i: number) => (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deletePreGoLive(i)} 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash size={18} weight="bold" />
                      </Button>
                    )
                  }
                ]} 
                onAdd={addPreGoLive}
                onSave={savePreGoLive}
                isSaving={isSaving}
              />
            </TabsContent>

            <TabsContent value="additional">
              <Section 
                ref={additionalCostRef}
                title="Additional Implementation Cost" 
                icon={<PlusCircle size={24} weight="duotone" className="mr-2" />}
                data={additionalCosts} 
                cols={[
                  { label: 'Description', render: (r: any, i: number) => <Input value={r.description ?? ''} onChange={(e) => update(setAdditionalCosts, i, 'description', e.target.value)} className="w-full" /> },
                  { label: 'Unit Cost', render: (r: any, i: number) => <InputNumber value={r.unit_cost ?? 0} onChange={(v: number) => update(setAdditionalCosts, i, 'unit_cost', v)} /> },
                  { label: 'Nos.', render: (r: any, i: number) => <InputNumber value={r.nos ?? 0} onChange={(v: number) => update(setAdditionalCosts, i, 'nos', v)} /> },
                  { label: 'Amount', render: (r: any) => Number((r.unit_cost ?? 0) * (r.nos ?? 0)).toFixed(2) },
                  { label: '', render: (r: any, i: number) => (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteAdditionalCost(i)} 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash size={18} weight="bold" />
                      </Button>
                    )
                  }
                ]} 
                onAdd={() => setAdditionalCosts(prev => [...prev, { obf_id: obfId, description: '', unit_cost: 0, nos: 0 }])}
                onSave={saveAdditionalCost}
                isSaving={isSaving}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>Back</Button>
        </CardFooter>
      </Card>
    </OBFWorkflow>
  );
}

const Section = React.forwardRef(({ title, data, cols, onAdd, icon, onSave, isSaving }: any, ref: any) => {
  return (
    <div ref={ref} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {onAdd && (
            <Button onClick={onAdd} variant="outline" size="sm">
              Add Row
            </Button>
          )}
          {onSave && (
            <Button onClick={onSave} disabled={isSaving} size="sm">
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="">
              {cols.map((c: any, i: number) => (
                <TableHead key={i} className="font-semibold text-slate-700 py-3">
                  {c.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row: any, i: number) => (
                <TableRow 
                  key={row.sr_no ?? i}
                  className=""
                >
                  {cols.map((c: any, j: number) => (
                    <TableCell key={j} className="py-2.5">
                      {c.render(row, i)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={cols.length} className="text-center py-4 text-slate-500">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

function InputNumber({ value, onChange, className, readOnly = false }: any) {
  return <Input 
    type="number" 
    step="0.01" 
    className={cn("w-full min-w-[100px] max-w-[150px]", className, readOnly ? "bg-gray-100" : "")} 
    value={value ?? 0} 
    onChange={e => !readOnly && onChange(parseFloat(e.target.value) || 0)} 
    readOnly={readOnly}
  />;
}

function InputPercent({ value, onChange, className, readOnly = false }: any) {
  // Value is stored as decimal (0.05 for 5%) but displayed as percentage
  const displayValue = typeof value === 'number' ? value * 100 : 0;
  
  return (
    <div className={cn("flex items-center w-24 border rounded-md", className, readOnly ? "bg-gray-100" : "")}>
      <Input 
        type="number" 
        step="0.01" 
        className={cn("px-2 py-1 w-16 border-0", readOnly ? "bg-gray-100" : "")} 
        value={displayValue}
        onChange={e => {
          if (!readOnly) {
            // Convert percentage back to decimal for storage
            const percentValue = parseFloat(e.target.value) || 0;
            onChange(percentValue / 100);
          }
        }} 
        readOnly={readOnly}
      />
      <span className="flex-none pr-2">%</span>
    </div>
  );
} 