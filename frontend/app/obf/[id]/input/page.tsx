'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { obfService, obfInputService } from '../../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Buildings, MapPin, Briefcase, Calculator, Info } from "@phosphor-icons/react";
import { OBFWorkflow } from "@/components/OBFWorkflow";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import Image from 'next/image';

interface InputResults {
  project_name: string;
  opportunity_id: string;
  location: string;
  state: string;
  vertical: string;
  project_type: string;
  projection_period: number;
  customer_payment_terms: number;
  capex_amortisation: 'Life of Asset' | 'Contract Period';
  amc_first_year: 'Yes' | 'No';
  depreciation: number;
  interest: 'Reducing Balance' | 'PMT' | 'EMI';
  asset_backing: 'Yes' | 'No';
  redeploy_asset: 'Yes' | 'No';
  rentals_escalation: number;
  manpower_mgmt_escalation: number;
  manpower_min_wage_escalation: number;
  capex_cost_escalation: number;
  operating_cost_escalation: number;
  rentals_credit_period: number;
  manpower_mgmt_credit_period: number;
  manpower_min_wage_credit_period: number;
  capex_cost_credit_period: number;
  operating_cost_credit_period: number;
}

interface ValidationErrors {
  [key: string]: string;
}

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands -UT', 'Chandigarh -UT',
  'Dadra & Nagar Haveli and Daman & Diu -UT', 'Delhi -UT',
  'Jammu and Kashmir -UT', 'Lakshadweep -UT', 'Puducherry-UT', 'Ladakh-UT'
];

const verticals = [
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

interface PageParams {
  id: string;
}

export default function InputResults({ params }: { params: Promise<PageParams> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [obfData, setObfData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [existingInputData, setExistingInputData] = useState<any>(null);
  const [inputResults, setInputResults] = useState<InputResults>({
    project_name: '',
    opportunity_id: '',
    location: '',
    state: '',
    vertical: '',
    project_type: '',
    projection_period: 0,
    customer_payment_terms: 0,
    capex_amortisation: 'Life of Asset',
    amc_first_year: 'No',
    depreciation: 0,
    interest: 'Reducing Balance',
    asset_backing: 'No',
    redeploy_asset: 'No',
    rentals_escalation: 0,
    manpower_mgmt_escalation: 0,
    manpower_min_wage_escalation: 0,
    capex_cost_escalation: 0,
    operating_cost_escalation: 0,
    rentals_credit_period: 0,
    manpower_mgmt_credit_period: 0,
    manpower_min_wage_credit_period: 0,
    capex_cost_credit_period: 0,
    operating_cost_credit_period: 0
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch the OBF details
      const response = await obfService.getById(id);
      setObfData(response.data);
      
      // Try to fetch existing input data if it exists
      try {
        const inputResponse = await obfInputService.getByObfId(id);
        if (inputResponse.data && Object.keys(inputResponse.data).length > 0) {
          setExistingInputData(inputResponse.data);
          setInputResults(prev => ({
            ...prev,
            ...inputResponse.data,
            project_name: inputResponse.data.project_name || response.data.project_name || '',
            opportunity_id: inputResponse.data.opportunity_id || response.data.opportunity_id || '',
            project_type: inputResponse.data.project_type || response.data.project_type || ''
          }));
        } else {
          setInputResults(prev => ({
            ...prev,
            project_name: response.data.project_name || '',
            opportunity_id: response.data.opportunity_id || '',
            project_type: response.data.project_type || ''
          }));
        }
      } catch (inputError) {
        // Pre-fill with OBF data if no input data exists
        setInputResults(prev => ({
          ...prev,
          project_name: response.data.project_name || '',
          opportunity_id: response.data.opportunity_id || '',
          project_type: response.data.project_type || ''
        }));
      }
      
      setError(null);
    } catch (error) {
      console.error('Error loading OBF data:', error);
      setError('Failed to load OBF data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Validation function
  const validateField = (field: keyof InputResults, value: any): string | null => {
    switch (field) {
      case 'project_name':
        return !value ? 'Project name is required' : null;
      case 'opportunity_id':
        return !value ? 'Opportunity ID is required' : 
               !/^[A-Za-z0-9-]+$/.test(value) ? 'Invalid Opportunity ID format' : null;
      case 'location':
        return !value ? 'Location is required' : null;
      case 'state':
        return !value ? 'State is required' : null;
      case 'vertical':
        return !value ? 'Vertical is required' : null;
      case 'project_type':
        return !value ? 'Project type is required' : null;
      case 'projection_period':
        return value < 0 ? 'Value cannot be negative' :
               value > 100 ? 'Value cannot exceed 100 years' : null;
      case 'customer_payment_terms':
      case 'rentals_credit_period':
      case 'manpower_mgmt_credit_period':
      case 'manpower_min_wage_credit_period':
      case 'capex_cost_credit_period':
      case 'operating_cost_credit_period':
        return value < 0 ? 'Value cannot be negative' :
               value > 999 ? 'Value cannot exceed 999 days' : null;
      case 'depreciation':
      case 'rentals_escalation':
      case 'manpower_mgmt_escalation':
      case 'manpower_min_wage_escalation':
      case 'capex_cost_escalation':
      case 'operating_cost_escalation':
        return value < 0 ? 'Value cannot be negative' :
               value > 999.99 ? 'Value cannot exceed 999.99%' : null;
      default:
        return null;
    }
  };

  const handleInputChange = (field: keyof InputResults, value: any) => {
    // If vertical is changed from LMD to non-LMD and current project type is not in nonLmdProjectTypes, reset it
    if (field === 'vertical' && value !== 'LMD' && !nonLmdProjectTypes.includes(inputResults.project_type)) {
      setInputResults(prev => ({
        ...prev,
        [field]: value,
        project_type: nonLmdProjectTypes[0] // Set to first non-LMD project type
      }));
    } else {
      setInputResults(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await obfService.saveInputResults(id, inputResults);
      if (response) {
        router.push(`/obf/${id}/working`);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Failed to save data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/obf/${id}`);
  };

  if (loading) {
    return (
      <OBFWorkflow id={id} currentStep="input">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Image src="/Loading/newpreeload.gif" unoptimized alt="Loading..." width={150} height={150} priority />
        <div className="mt-4 text-lg text-gray-500">Loading...</div>
      </div>
      </OBFWorkflow>
    );
  }

  if (error) {
    return (
      <OBFWorkflow id={id} currentStep="input">
      <Card className="bg-red-50 border-red-200 text-red-700">
        <CardContent className="py-8">
          <div className="flex flex-col items-center text-center">
            <p className="mb-4">{error}</p>
            <Button onClick={() => router.push('/obf')}>Return to OBF List</Button>
          </div>
        </CardContent>
      </Card>
      </OBFWorkflow>
    );
  }

  if (!obfData) {
    return (
      <OBFWorkflow id={id} currentStep="input">
      <Card className="bg-amber-50 border-amber-200 text-amber-700">
        <CardContent className="py-8">
          <div className="flex flex-col items-center text-center">
            <p className="mb-4">OBF not found</p>
            <Button onClick={() => router.push('/obf')}>Return to OBF List</Button>
          </div>
        </CardContent>
      </Card>
      </OBFWorkflow>
    );
  }

  const inputContentSection = (
    <Card>
      <CardHeader>
        <CardTitle>Input Result Sheet</CardTitle>
        <CardDescription>
          Project Code: {obfData.project_code} | Client: {obfData.client_name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Buildings size={20} weight="bold" className="text-primary" />
              Basic Information
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="project_name" className="flex items-center gap-2">
                Project Name*
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter the name of your project</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="project_name"
                value={inputResults.project_name}
                onChange={(e) => handleInputChange('project_name', e.target.value)}
                placeholder="Enter project name"
                className={validationErrors.project_name ? 'border-red-500' : ''}
              />
              {validationErrors.project_name && (
                <p className="text-sm text-red-500">{validationErrors.project_name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="opportunity_id">Opportunity ID (SF ID)</Label>
              <Input
                id="opportunity_id"
                value={inputResults.opportunity_id}
                onChange={(e) => handleInputChange('opportunity_id', e.target.value)}
                placeholder="Enter opportunity ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={inputResults.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter location"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select 
                value={inputResults.state} 
                onValueChange={(value) => handleInputChange('state', value)}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase size={20} weight="bold" className="text-primary" />
              Project Details
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="vertical">Vertical</Label>
              <Select 
                value={inputResults.vertical} 
                onValueChange={(value) => handleInputChange('vertical', value)}
              >
                <SelectTrigger id="vertical">
                  <SelectValue placeholder="Select vertical" />
                </SelectTrigger>
                <SelectContent>
                  {verticals.map((vertical) => (
                    <SelectItem key={vertical} value={vertical}>{vertical}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project_type" className="flex items-center gap-2">
                Project Type*
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{inputResults.vertical === 'LMD' ? 'All project types are available for LMD vertical' : 'Only specific project types are available for non-LMD verticals'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select 
                value={inputResults.project_type} 
                onValueChange={(value) => handleInputChange('project_type', value)}
              >
                <SelectTrigger id="project_type">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {(inputResults.vertical === 'LMD' ? allProjectTypes : nonLmdProjectTypes).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projection_period" className="flex items-center gap-2">
                Projection Period (Years)*
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter the number of years for projection (max 100 years)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="projection_period"
                type="number"
                min="0"
                max="100"
                value={inputResults.projection_period}
                onChange={(e) => handleInputChange('projection_period', Number(e.target.value))}
                placeholder="Enter projection period"
                className={validationErrors.projection_period ? 'border-red-500' : ''}
              />
              {validationErrors.projection_period && (
                <p className="text-sm text-red-500">{validationErrors.projection_period}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer_payment_terms">Customer Payment Terms (Days)</Label>
              <Input
                id="customer_payment_terms"
                type="number"
                value={inputResults.customer_payment_terms}
                onChange={(e) => handleInputChange('customer_payment_terms', Number(e.target.value))}
                placeholder="Enter payment terms"
              />
            </div>
          </div>
        </div>
        
        {/* Financial Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calculator size={20} weight="bold" className="text-primary" />
              Financial Parameters
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="capex_amortisation">CAPEX Amortisation</Label>
              <Select 
                value={inputResults.capex_amortisation} 
                onValueChange={(value) => handleInputChange('capex_amortisation', value as 'Life of Asset' | 'Contract Period')}
              >
                <SelectTrigger id="capex_amortisation">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Life of Asset">Life of Asset</SelectItem>
                  <SelectItem value="Contract Period">Contract Period</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amc_first_year">AMC First Year</Label>
              <Select 
                value={inputResults.amc_first_year} 
                onValueChange={(value) => handleInputChange('amc_first_year', value as 'Yes' | 'No')}
              >
                <SelectTrigger id="amc_first_year">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="depreciation" className="flex items-center gap-2">
                Depreciation (%)*
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter depreciation percentage (max 999.99%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="depreciation"
                type="number"
                min="0"
                max="999.99"
                step="0.01"
                value={inputResults.depreciation}
                onChange={(e) => handleInputChange('depreciation', Number(e.target.value))}
                placeholder="Enter depreciation percentage"
                className={validationErrors.depreciation ? 'border-red-500' : ''}
              />
              {validationErrors.depreciation && (
                <p className="text-sm text-red-500">{validationErrors.depreciation}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interest">Interest Type</Label>
              <Select 
                value={inputResults.interest} 
                onValueChange={(value) => handleInputChange('interest', value as 'Reducing Balance' | 'PMT' | 'EMI')}
              >
                <SelectTrigger id="interest">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reducing Balance">Reducing Balance</SelectItem>
                  <SelectItem value="PMT">PMT</SelectItem>
                  <SelectItem value="EMI">EMI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin size={20} weight="bold" className="text-primary" />
              Asset Information
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="asset_backing">Asset Backing</Label>
              <Select 
                value={inputResults.asset_backing} 
                onValueChange={(value) => handleInputChange('asset_backing', value as 'Yes' | 'No')}
              >
                <SelectTrigger id="asset_backing">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="redeploy_asset">Redeploy Asset</Label>
              <Select 
                value={inputResults.redeploy_asset} 
                onValueChange={(value) => handleInputChange('redeploy_asset', value as 'Yes' | 'No')}
              >
                <SelectTrigger id="redeploy_asset">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Escalation & Credit Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">YOY Escalation (%)</h2>
            
            <div className="space-y-2">
              <Label htmlFor="rentals_escalation" className="flex items-center gap-2">
                Rentals (%)*
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter rentals escalation percentage (max 999.99%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="rentals_escalation"
                type="number"
                min="0"
                max="999.99"
                step="0.01"
                value={inputResults.rentals_escalation}
                onChange={(e) => handleInputChange('rentals_escalation', Number(e.target.value))}
                placeholder="Enter rentals escalation"
                className={validationErrors.rentals_escalation ? 'border-red-500' : ''}
              />
              {validationErrors.rentals_escalation && (
                <p className="text-sm text-red-500">{validationErrors.rentals_escalation}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manpower_mgmt_escalation">Manpower (Mgmt.)</Label>
              <Input
                id="manpower_mgmt_escalation"
                type="number"
                value={inputResults.manpower_mgmt_escalation}
                onChange={(e) => handleInputChange('manpower_mgmt_escalation', Number(e.target.value))}
                placeholder="Enter manpower mgmt escalation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manpower_min_wage_escalation">Manpower (Min Wage)</Label>
              <Input
                id="manpower_min_wage_escalation"
                type="number"
                value={inputResults.manpower_min_wage_escalation}
                onChange={(e) => handleInputChange('manpower_min_wage_escalation', Number(e.target.value))}
                placeholder="Enter manpower min wage escalation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capex_cost_escalation">CAPEX Cost</Label>
              <Input
                id="capex_cost_escalation"
                type="number"
                value={inputResults.capex_cost_escalation}
                onChange={(e) => handleInputChange('capex_cost_escalation', Number(e.target.value))}
                placeholder="Enter CAPEX cost escalation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="operating_cost_escalation">Operating Cost</Label>
              <Input
                id="operating_cost_escalation"
                type="number"
                value={inputResults.operating_cost_escalation}
                onChange={(e) => handleInputChange('operating_cost_escalation', Number(e.target.value))}
                placeholder="Enter operating cost escalation"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Credit Period (Days)</h2>
            
            <div className="space-y-2">
              <Label htmlFor="rentals_credit_period" className="flex items-center gap-2">
                Rentals (Days)*
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter rentals credit period in days (max 999 days)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="rentals_credit_period"
                type="number"
                min="0"
                max="999"
                value={inputResults.rentals_credit_period}
                onChange={(e) => handleInputChange('rentals_credit_period', Number(e.target.value))}
                placeholder="Enter rentals credit period"
                className={validationErrors.rentals_credit_period ? 'border-red-500' : ''}
              />
              {validationErrors.rentals_credit_period && (
                <p className="text-sm text-red-500">{validationErrors.rentals_credit_period}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manpower_mgmt_credit_period">Manpower (Mgmt.)</Label>
              <Input
                id="manpower_mgmt_credit_period"
                type="number"
                value={inputResults.manpower_mgmt_credit_period}
                onChange={(e) => handleInputChange('manpower_mgmt_credit_period', Number(e.target.value))}
                placeholder="Enter manpower mgmt credit period"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manpower_min_wage_credit_period">Manpower (Min Wage)</Label>
              <Input
                id="manpower_min_wage_credit_period"
                type="number"
                value={inputResults.manpower_min_wage_credit_period}
                onChange={(e) => handleInputChange('manpower_min_wage_credit_period', Number(e.target.value))}
                placeholder="Enter manpower min wage credit period"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capex_cost_credit_period">CAPEX Cost</Label>
              <Input
                id="capex_cost_credit_period"
                type="number"
                value={inputResults.capex_cost_credit_period}
                onChange={(e) => handleInputChange('capex_cost_credit_period', Number(e.target.value))}
                placeholder="Enter CAPEX cost credit period"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="operating_cost_credit_period">Operating Cost</Label>
              <Input
                id="operating_cost_credit_period"
                type="number"
                value={inputResults.operating_cost_credit_period}
                onChange={(e) => handleInputChange('operating_cost_credit_period', Number(e.target.value))}
                placeholder="Enter operating cost credit period"
              />
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft size={16} weight="bold" /> Back
        </Button>
        
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="gap-2"
        >
          {saving ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              Saving...
            </>
          ) : (
            <>
              Save & Continue <ArrowRight size={16} weight="bold" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <OBFWorkflow id={id} currentStep="input">
      {inputContentSection}
    </OBFWorkflow>
  );
} 