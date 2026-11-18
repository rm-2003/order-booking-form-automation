"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { obfWorkingService } from "@/app/services/api";
import { OBFWorkflow } from "@/components/OBFWorkflow";
import { obfService } from "@/app/services/api";
import Image from 'next/image';

const periods = ["Year 1", "FY-2026", "Contract Period"];

// Interfaces matching our backend models
interface OBFRevenue {
  obf_id: string;
  monthly_fixed_revenue_qty: number;
  monthly_fixed_revenue_rate: number;
  monthly_fixed_revenue_amt_year1: number;
  monthly_fixed_revenue_amt_fy2026: number;
  monthly_fixed_revenue_amt_contract: number;
  monthly_variable_revenue_qty: number;
  monthly_variable_revenue_rate: number;
  monthly_variable_revenue_amt_year1: number;
  monthly_variable_revenue_amt_fy2026: number;
  monthly_variable_revenue_amt_contract: number;
  transport_value_added_revenue_year1: number;
  transport_value_added_revenue_fy2026: number;
  transport_value_added_revenue_contract: number;
  total_revenue_year1: number;
  total_revenue_fy2026: number;
  total_revenue_contract: number;
  yoy_escalation_percent: number;
  go_live_date: string | null;
}

interface OBFBARates {
  obf_id: string;
  warehouse_rent_qty: number;
  warehouse_rent_rate: number;
  warehouse_rent_amt_year1: number;
  warehouse_rent_amt_fy2026: number;
  warehouse_rent_amt_contract: number;
  manpower_cost_mgmt_qty: number;
  manpower_cost_mgmt_rate: number;
  manpower_cost_mgmt_amt_year1: number;
  manpower_cost_mgmt_amt_fy2026: number;
  manpower_cost_mgmt_amt_contract: number;
  manpower_cost_min_wage_qty: number;
  manpower_cost_min_wage_rate: number;
  manpower_cost_min_wage_amt_year1: number;
  manpower_cost_min_wage_amt_fy2026: number;
  manpower_cost_min_wage_amt_contract: number;
  consumables_qty: number;
  consumables_rate: number;
  consumables_amt_year1: number;
  consumables_amt_fy2026: number;
  consumables_amt_contract: number;
  one_time_ammortised_cost_qty: number;
  one_time_ammortised_cost_rate: number;
  one_time_ammortised_cost_amt_year1: number;
  one_time_ammortised_cost_amt_fy2026: number;
  one_time_ammortised_cost_amt_contract: number;
  capex_write_off_qty: number;
  capex_write_off_rate: number;
  capex_write_off_amt_year1: number;
  capex_write_off_amt_fy2026: number;
  capex_write_off_amt_contract: number;
  one_time_ammortised_cost_impl_qty: number;
  one_time_ammortised_cost_impl_rate: number;
  one_time_ammortised_cost_impl_amt_year1: number;
  one_time_ammortised_cost_impl_amt_fy2026: number;
  one_time_ammortised_cost_impl_amt_contract: number;
  total_ba_cost_year1: number;
  total_ba_cost_fy2026: number;
  total_ba_cost_contract: number;
  yoy_escalation_percent: number;
}

interface OBFDirectExpenses {
  obf_id: string;
  transport_cost_qty: number;
  transport_cost_rate: number;
  transport_cost_amt_year1: number;
  transport_cost_amt_fy2026: number;
  transport_cost_amt_contract: number;
  transport_manpower_cost_qty: number;
  transport_manpower_cost_rate: number;
  transport_manpower_cost_amt_year1: number;
  transport_manpower_cost_amt_fy2026: number;
  transport_manpower_cost_amt_contract: number;
  gps_ct_running_expenses_qty: number;
  gps_ct_running_expenses_rate: number;
  gps_ct_running_expenses_amt_year1: number;
  gps_ct_running_expenses_amt_fy2026: number;
  gps_ct_running_expenses_amt_contract: number;
  total_direct_expenses_year1: number;
  total_direct_expenses_fy2026: number;
  total_direct_expenses_contract: number;
  yoy_escalation_percent: number;
}

interface OBFFinancialMetrics {
  obf_id: string;
  gross_margin_year1: number;
  gross_margin_fy2026: number;
  gross_margin_contract: number;
  gross_percent_year1: number;
  gross_percent_fy2026: number;
  gross_percent_contract: number;
  trade_discount_year1: number;
  trade_discount_fy2026: number;
  trade_discount_contract: number;
  gross_margin_after_discount_year1: number;
  gross_margin_after_discount_fy2026: number;
  gross_margin_after_discount_contract: number;
  gross_margin_after_discount_percent_year1: number;
  gross_margin_after_discount_percent_fy2026: number;
  gross_margin_after_discount_percent_contract: number;
  depreciation_ammortisation_year1: number;
  depreciation_ammortisation_fy2026: number;
  depreciation_ammortisation_contract: number;
  ebit_year1: number;
  ebit_fy2026: number;
  ebit_contract: number;
  ebit_percent_year1: number;
  ebit_percent_fy2026: number;
  ebit_percent_contract: number;
  interest_cost_year1: number;
  interest_cost_fy2026: number;
  interest_cost_contract: number;
  ebt_year1: number;
  ebt_fy2026: number;
  ebt_contract: number;
  ebt_percent_year1: number;
  ebt_percent_fy2026: number;
  ebt_percent_contract: number;
}

// Helper function to calculate months between dates
function getMonthsBetweenDates(startDate: Date, endDate: Date): number {
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                 (endDate.getMonth() - startDate.getMonth()) + 1;
  return Math.max(0, months);
}

// Helper function to get end of financial year date
function getEndOfFinancialYear(date: Date): Date {
  const year = date.getFullYear();
  return new Date(year, 2, 31); // March 31st of the same year
}

// Helper function to get next financial year end date
function getNextFinancialYearEnd(date: Date): Date {
  const year = date.getFullYear();
  return new Date(year + 1, 2, 31); // March 31st of next year
}

// Helper function to calculate amounts based on period
function calculateAmounts(
  qty: number,
  rate: number,
  goLiveDate: string | null,
  projectPeriod: number,
  yoyEscalation: number = 0
): { year1: number; fy2026: number; contract: number } {
  // Defensive: coerce all to numbers and default to 0 if invalid
  qty = Number(qty) || 0;
  rate = Number(rate) || 0;
  yoyEscalation = Number(yoyEscalation) || 0;
  projectPeriod = Number(projectPeriod) || 1;

  // Debug log
  console.log('calculateAmounts inputs:', { qty, rate, goLiveDate, projectPeriod, yoyEscalation });

  // If no go live date, return 0 for all periods
  if (!goLiveDate) {
    return { year1: 0, fy2026: 0, contract: 0 };
  }

  const startDate = new Date(goLiveDate);
  const endOfFY = getEndOfFinancialYear(startDate);
  const nextFYEnd = getNextFinancialYearEnd(startDate);
  
  // Calculate months for each period
  const year1Months = getMonthsBetweenDates(startDate, nextFYEnd);
  const fy2026Months = 12; // Exactly one year
  const contractMonths = projectPeriod * 12; // Convert years to months

  // Calculate monthly amount
  const monthlyAmount = qty * rate;
  console.log('monthlyAmount:', monthlyAmount);

  // Calculate contract amount with YOY escalation
  let contractAmount = 0;
  let currentYearAmount = monthlyAmount * 12; // Base yearly amount
  
  for (let year = 0; year < projectPeriod; year++) {
    contractAmount += currentYearAmount;
    currentYearAmount *= (1 + yoyEscalation / 100);
  }
  console.log('contractAmount:', contractAmount);

  // Ensure we return valid numbers
  return {
    year1: Number((monthlyAmount * year1Months).toFixed(2)) || 0,
    fy2026: Number((monthlyAmount * fy2026Months).toFixed(2)) || 0,
    contract: Number(contractAmount.toFixed(2)) || 0
  };
}

function renderRow(label: string, values: number[], onChange: (idx: number, val: number) => void) {
  return (
    <tr>
      <td className="font-medium whitespace-nowrap pr-2 py-1">{label}</td>
      {values.map((v, idx) => (
        <td key={idx} className="px-2 py-1">
          <Input
            type="number"
            step="0.01"
            value={v}
            onChange={e => onChange(idx, parseFloat(e.target.value) || 0)}
            className="w-24"
          />
        </td>
      ))}
    </tr>
  );
}

// Helper functions for rendering form inputs adapted for new structure with single rate
function renderRowWithQtyRateAmt(label: string, 
  qty: number, onQtyChange: (val: number) => void,
  rate: number, onRateChange: (val: number) => void,
  amtYear1: number, amtFy2026: number, amtContract: number) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="font-medium whitespace-nowrap pr-2 py-2">{label}</td>
      <td className="px-2 py-2 text-right">
        <Input
          type="number"
          step="0.01"
          value={qty || 0}
          onChange={e => onQtyChange(parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      </td>
      <td className="px-2 py-2 text-right">
        <Input
          type="number"
          step="0.01"
          value={rate || 0}
          onChange={e => onRateChange(parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      </td>
      <td className="px-2 py-2 text-right">
        <Input
          type="number"
          step="0.01"
          value={amtYear1 || 0}
          readOnly
          className="w-24 bg-muted"
        />
      </td>
      <td className="px-2 py-2 text-right">
        <Input
          type="number"
          step="0.01"
          value={amtFy2026 || 0}
          readOnly
          className="w-24 bg-muted"
        />
      </td>
      <td className="px-2 py-2 text-right">
        <Input
          type="number"
          step="0.01"
          value={amtContract || 0}
          readOnly
          className="w-24 bg-muted"
        />
      </td>
    </tr>
  );
}

function renderValueAddedRow(label: string, 
  valueYear1: number, onValueYear1Change: (val: number) => void,
  valueFy2026: number, onValueFy2026Change: (val: number) => void,
  valueContract: number, onValueContractChange: (val: number) => void) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="font-medium whitespace-nowrap pr-2 py-2">{label}</td>
      <td className="px-2 py-2" colSpan={2}></td>
      <td className="px-2 py-2 text-right">
        <Input
          type="number"
          step="0.01"
          value={valueYear1 || 0}
          onChange={e => onValueYear1Change(parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      </td>
      <td className="px-2 py-2 text-right">
        <Input
          type="number"
          step="0.01"
          value={valueFy2026 || 0}
          onChange={e => onValueFy2026Change(parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      </td>
      <td className="px-2 py-2 text-right">
        <Input
          type="number"
          step="0.01"
          value={valueContract || 0}
          onChange={e => onValueContractChange(parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      </td>
    </tr>
  );
}

function renderMetricInput(label: string, 
  valueYear1: number, onValueYear1Change: (val: number) => void,
  valueFy2026: number, onValueFy2026Change: (val: number) => void,
  valueContract: number, onValueContractChange: (val: number) => void) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="font-medium py-2">{label}</td>
      <td className="px-2 py-2">
        <Input
          type="number"
          step="0.01"
          value={valueYear1 || 0}
          onChange={e => onValueYear1Change(parseFloat(e.target.value) || 0)}
          className="w-full"
        />
      </td>
      <td className="px-2 py-2">
        <Input
          type="number"
          step="0.01"
          value={valueFy2026 || 0}
          onChange={e => onValueFy2026Change(parseFloat(e.target.value) || 0)}
          className="w-full"
        />
      </td>
      <td className="px-2 py-2">
        <Input
          type="number"
          step="0.01"
          value={valueContract || 0}
          onChange={e => onValueContractChange(parseFloat(e.target.value) || 0)}
          className="w-full"
        />
      </td>
    </tr>
  );
}

function renderMetricCalc(label: string, 
  valueYear1: number, valueFy2026: number, valueContract: number,
  isPercent: boolean = false) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="font-medium py-2">{label}</td>
      <td className="px-2 py-2">
        <div className="bg-gray-50 rounded px-3 py-1.5 text-right">
          {Number(valueYear1 || 0).toFixed(2)}
          {isPercent && <span className="ml-1">%</span>}
        </div>
      </td>
      <td className="px-2 py-2">
        <div className="bg-gray-50 rounded px-3 py-1.5 text-right">
          {Number(valueFy2026 || 0).toFixed(2)}
          {isPercent && <span className="ml-1">%</span>}
        </div>
      </td>
      <td className="px-2 py-2">
        <div className="bg-gray-50 rounded px-3 py-1.5 text-right">
          {Number(valueContract || 0).toFixed(2)}
          {isPercent && <span className="ml-1">%</span>}
        </div>
      </td>
    </tr>
  );
}

function renderTotalRow(label: string, valueYear1: number, valueFy2026: number, valueContract: number) {
  return (
    <tr className="font-bold bg-gray-100 border-t border-b border-gray-300">
      <td className="whitespace-nowrap pr-2 py-2">{label}</td>
      <td className="px-2 py-2" colSpan={2}></td>
      <td className="px-2 py-2 text-right">{Number(valueYear1 || 0).toFixed(2)}</td>
      <td className="px-2 py-2 text-right">{Number(valueFy2026 || 0).toFixed(2)}</td>
      <td className="px-2 py-2 text-right">{Number(valueContract || 0).toFixed(2)}</td>
    </tr>
  );
}

function renderYOYEscalationRow(label: string, value: number, onChange: (val: number) => void) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="font-medium whitespace-nowrap pr-2 py-2">{label}</td>
      <td className="px-2 py-2 text-right" colSpan={4}>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step="0.01"
            value={value || 0}
            onChange={e => onChange(parseFloat(e.target.value) || 0)}
            className="w-24"
          />
          <span className="text-gray-500">%</span>
        </div>
      </td>
    </tr>
  );
}

function renderGoLiveDateRow(value: string | null, onChange: (val: string) => void) {
  // Format the date value to YYYY-MM-DD for the input field
  let formattedDate = '';
  if (value) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Invalid date:', error);
    }
  }
  
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="font-medium whitespace-nowrap pr-2 py-2">Go Live Date</td>
      <td className="px-2 py-2 text-right" colSpan={4}>
        <Input
          type="date"
          value={formattedDate}
          onChange={e => onChange(e.target.value)}
          className="w-48"
        />
      </td>
    </tr>
  );
}

export default function OBFWorking() {
  const params = useParams();
  const obfId = params.id as string;
  
  // State for data from API
  const [revenue, setRevenue] = useState<OBFRevenue | null>(null);
  const [baRates, setBARates] = useState<OBFBARates | null>(null);
  const [directExpenses, setDirectExpenses] = useState<OBFDirectExpenses | null>(null);
  const [financialMetrics, setFinancialMetrics] = useState<OBFFinancialMetrics | null>(null);
  const [projectPeriod, setProjectPeriod] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Always use a safe project period (>= 1)
  const safeProjectPeriod = Number(projectPeriod) >= 1 ? Number(projectPeriod) : 1;

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Load all data in parallel
        const [revenueRes, baRatesRes, directExpensesRes, financialMetricsRes, inputResultRes] = await Promise.all([
          obfWorkingService.getRevenue(obfId),
          obfWorkingService.getBARates(obfId),
          obfWorkingService.getDirectExpenses(obfId),
          obfWorkingService.getFinancialMetrics(obfId),
          obfService.getInputResults(obfId)
        ]);

        console.log('API Responses:', {
          revenue: revenueRes.data,
          baRates: baRatesRes.data,
          directExpenses: directExpensesRes.data,
          financialMetrics: financialMetricsRes.data,
          inputResult: inputResultRes.data
        });

        // Set project period from input result
        if (inputResultRes.data?.projection_period) {
          setProjectPeriod(inputResultRes.data.projection_period);
        }

        // Check if data exists for this OBF, if not create default structure
        if (revenueRes.data) {
          console.log('Setting revenue from API:', revenueRes.data);
          setRevenue(revenueRes.data);
        } else {
          console.log('Creating default revenue structure');
          setRevenue(createDefaultRevenue());
        }

        if (baRatesRes.data) {
          console.log('Setting BA rates from API:', baRatesRes.data);
          setBARates(baRatesRes.data);
        } else {
          console.log('Creating default BA rates structure');
          setBARates(createDefaultBARates());
        }
        
        if (directExpensesRes.data) {
          console.log('Setting direct expenses from API:', directExpensesRes.data);
          setDirectExpenses(directExpensesRes.data);
        } else {
          console.log('Creating default direct expenses structure');
          setDirectExpenses(createDefaultDirectExpenses());
        }
        
        if (financialMetricsRes.data) {
          console.log('Setting financial metrics from API:', financialMetricsRes.data);
          // Convert string values to numbers
          const parsedMetrics = {
            ...financialMetricsRes.data,
            gross_margin_year1: Number(financialMetricsRes.data.gross_margin_year1),
            gross_margin_fy2026: Number(financialMetricsRes.data.gross_margin_fy2026),
            gross_margin_contract: Number(financialMetricsRes.data.gross_margin_contract),
            gross_percent_year1: Number(financialMetricsRes.data.gross_percent_year1),
            gross_percent_fy2026: Number(financialMetricsRes.data.gross_percent_fy2026),
            gross_percent_contract: Number(financialMetricsRes.data.gross_percent_contract),
            trade_discount_year1: Number(financialMetricsRes.data.trade_discount_year1),
            trade_discount_fy2026: Number(financialMetricsRes.data.trade_discount_fy2026),
            trade_discount_contract: Number(financialMetricsRes.data.trade_discount_contract),
            gross_margin_after_discount_year1: Number(financialMetricsRes.data.gross_margin_after_discount_year1 || 0),
            gross_margin_after_discount_fy2026: Number(financialMetricsRes.data.gross_margin_after_discount_fy2026 || 0),
            gross_margin_after_discount_contract: Number(financialMetricsRes.data.gross_margin_after_discount_contract || 0),
            gross_margin_after_discount_percent_year1: Number(financialMetricsRes.data.gross_margin_after_discount_percent_year1 || 0),
            gross_margin_after_discount_percent_fy2026: Number(financialMetricsRes.data.gross_margin_after_discount_percent_fy2026 || 0),
            gross_margin_after_discount_percent_contract: Number(financialMetricsRes.data.gross_margin_after_discount_percent_contract || 0),
            depreciation_ammortisation_year1: Number(financialMetricsRes.data.depreciation_ammortisation_year1),
            depreciation_ammortisation_fy2026: Number(financialMetricsRes.data.depreciation_ammortisation_fy2026),
            depreciation_ammortisation_contract: Number(financialMetricsRes.data.depreciation_ammortisation_contract),
            ebit_year1: Number(financialMetricsRes.data.ebit_year1),
            ebit_fy2026: Number(financialMetricsRes.data.ebit_fy2026),
            ebit_contract: Number(financialMetricsRes.data.ebit_contract),
            ebit_percent_year1: Number(financialMetricsRes.data.ebit_percent_year1),
            ebit_percent_fy2026: Number(financialMetricsRes.data.ebit_percent_fy2026),
            ebit_percent_contract: Number(financialMetricsRes.data.ebit_percent_contract),
            interest_cost_year1: Number(financialMetricsRes.data.interest_cost_year1),
            interest_cost_fy2026: Number(financialMetricsRes.data.interest_cost_fy2026),
            interest_cost_contract: Number(financialMetricsRes.data.interest_cost_contract),
            ebt_year1: Number(financialMetricsRes.data.ebt_year1),
            ebt_fy2026: Number(financialMetricsRes.data.ebt_fy2026),
            ebt_contract: Number(financialMetricsRes.data.ebt_contract),
            ebt_percent_year1: Number(financialMetricsRes.data.ebt_percent_year1),
            ebt_percent_fy2026: Number(financialMetricsRes.data.ebt_percent_fy2026),
            ebt_percent_contract: Number(financialMetricsRes.data.ebt_percent_contract)
          };
          setFinancialMetrics(parsedMetrics);
        } else {
          console.log('Creating default financial metrics structure');
          setFinancialMetrics(createDefaultFinancialMetrics());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
        
        // Create default structures if API call fails
        setRevenue(createDefaultRevenue());
        setBARates(createDefaultBARates());
        setDirectExpenses(createDefaultDirectExpenses());
        setFinancialMetrics(createDefaultFinancialMetrics());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [obfId]);

  // Calculate financial metrics
  const calculateFinancialMetrics = () => {
    if (!revenue || !baRates || !directExpenses || !financialMetrics) return {};
    
    // Gross margin calculation
    const grossMarginYear1 = (revenue.total_revenue_year1 ?? 0) - (baRates.total_ba_cost_year1 ?? 0) - (directExpenses.total_direct_expenses_year1 ?? 0);
    const grossMarginFy2026 = (revenue.total_revenue_fy2026 ?? 0) - (baRates.total_ba_cost_fy2026 ?? 0) - (directExpenses.total_direct_expenses_fy2026 ?? 0);
    const grossMarginContract = (revenue.total_revenue_contract ?? 0) - (baRates.total_ba_cost_contract ?? 0) - (directExpenses.total_direct_expenses_contract ?? 0);
    
    // Gross percentage calculation
    const grossPercentYear1 = (revenue.total_revenue_year1 ?? 0) !== 0 
      ? (grossMarginYear1 / (revenue.total_revenue_year1 ?? 0)) * 100 
      : 0;
    
    const grossPercentFy2026 = (revenue.total_revenue_fy2026 ?? 0) !== 0 
      ? (grossMarginFy2026 / (revenue.total_revenue_fy2026 ?? 0)) * 100 
      : 0;
    
    const grossPercentContract = (revenue.total_revenue_contract ?? 0) !== 0 
      ? (grossMarginContract / (revenue.total_revenue_contract ?? 0)) * 100 
      : 0;
    
    // Gross margin after discount calculation
    const gmadYear1 = grossMarginYear1 + (financialMetrics.trade_discount_year1 ?? 0);
    const gmadFy2026 = grossMarginFy2026 + (financialMetrics.trade_discount_fy2026 ?? 0);
    const gmadContract = grossMarginContract + (financialMetrics.trade_discount_contract ?? 0);
    
    // Gross margin after discount percentage calculation
    const gmadPercentYear1 = (revenue.total_revenue_year1 ?? 0) !== 0 
      ? (gmadYear1 / (revenue.total_revenue_year1 ?? 0)) * 100 
      : 0;
    
    const gmadPercentFy2026 = (revenue.total_revenue_fy2026 ?? 0) !== 0 
      ? (gmadFy2026 / (revenue.total_revenue_fy2026 ?? 0)) * 100 
      : 0;
    
    const gmadPercentContract = (revenue.total_revenue_contract ?? 0) !== 0 
      ? (gmadContract / (revenue.total_revenue_contract ?? 0)) * 100 
      : 0;
    
    // EBIT calculation
    const ebitYear1 = gmadYear1 - (financialMetrics.depreciation_ammortisation_year1 ?? 0);
    const ebitFy2026 = gmadFy2026 - (financialMetrics.depreciation_ammortisation_fy2026 ?? 0);
    const ebitContract = gmadContract - (financialMetrics.depreciation_ammortisation_contract ?? 0);
    
    // EBIT percentage calculation
    const ebitPercentYear1 = (revenue.total_revenue_year1 ?? 0) !== 0 
      ? (ebitYear1 / (revenue.total_revenue_year1 ?? 0)) * 100 
      : 0;
    
    const ebitPercentFy2026 = (revenue.total_revenue_fy2026 ?? 0) !== 0 
      ? (ebitFy2026 / (revenue.total_revenue_fy2026 ?? 0)) * 100 
      : 0;
    
    const ebitPercentContract = (revenue.total_revenue_contract ?? 0) !== 0 
      ? (ebitContract / (revenue.total_revenue_contract ?? 0)) * 100 
      : 0;
    
    // EBT calculation
    const ebtYear1 = ebitYear1 - (financialMetrics.interest_cost_year1 ?? 0);
    const ebtFy2026 = ebitFy2026 - (financialMetrics.interest_cost_fy2026 ?? 0);
    const ebtContract = ebitContract - (financialMetrics.interest_cost_contract ?? 0);
    
    // EBT percentage calculation
    const ebtPercentYear1 = (revenue.total_revenue_year1 ?? 0) !== 0 
      ? (ebtYear1 / (revenue.total_revenue_year1 ?? 0)) * 100 
      : 0;
    
    const ebtPercentFy2026 = (revenue.total_revenue_fy2026 ?? 0) !== 0 
      ? (ebtFy2026 / (revenue.total_revenue_fy2026 ?? 0)) * 100 
      : 0;
    
    const ebtPercentContract = (revenue.total_revenue_contract ?? 0) !== 0 
      ? (ebtContract / (revenue.total_revenue_contract ?? 0)) * 100 
      : 0;
    
    return {
      gross_margin_year1: grossMarginYear1,
      gross_margin_fy2026: grossMarginFy2026,
      gross_margin_contract: grossMarginContract,
      gross_percent_year1: grossPercentYear1,
      gross_percent_fy2026: grossPercentFy2026,
      gross_percent_contract: grossPercentContract,
      gross_margin_after_discount_year1: gmadYear1,
      gross_margin_after_discount_fy2026: gmadFy2026,
      gross_margin_after_discount_contract: gmadContract,
      gross_margin_after_discount_percent_year1: gmadPercentYear1,
      gross_margin_after_discount_percent_fy2026: gmadPercentFy2026,
      gross_margin_after_discount_percent_contract: gmadPercentContract,
      ebit_year1: ebitYear1,
      ebit_fy2026: ebitFy2026,
      ebit_contract: ebitContract,
      ebit_percent_year1: ebitPercentYear1,
      ebit_percent_fy2026: ebitPercentFy2026,
      ebit_percent_contract: ebitPercentContract,
      ebt_year1: ebtYear1,
      ebt_fy2026: ebtFy2026,
      ebt_contract: ebtContract,
      ebt_percent_year1: ebtPercentYear1,
      ebt_percent_fy2026: ebtPercentFy2026,
      ebt_percent_contract: ebtPercentContract
    };
  };

  // Update financial metrics whenever other values change
  useEffect(() => {
    if (!revenue || !baRates || !directExpenses || !financialMetrics) return;
    
    // Calculate financial metrics based on other values
    const newMetrics = calculateFinancialMetrics();
    setFinancialMetrics(prev => ({
      ...prev!,
      ...newMetrics
    }));
  }, [revenue, baRates, directExpenses, financialMetrics?.trade_discount_year1, 
      financialMetrics?.trade_discount_fy2026, financialMetrics?.trade_discount_contract,
      financialMetrics?.depreciation_ammortisation_year1, financialMetrics?.depreciation_ammortisation_fy2026,
      financialMetrics?.depreciation_ammortisation_contract, financialMetrics?.interest_cost_year1,
      financialMetrics?.interest_cost_fy2026, financialMetrics?.interest_cost_contract]);

  // Create default data structures
  const createDefaultRevenue = (): OBFRevenue => ({
    obf_id: obfId,
    monthly_fixed_revenue_qty: 0,
    monthly_fixed_revenue_rate: 0,
    monthly_fixed_revenue_amt_year1: 0,
    monthly_fixed_revenue_amt_fy2026: 0,
    monthly_fixed_revenue_amt_contract: 0,
    monthly_variable_revenue_qty: 0,
    monthly_variable_revenue_rate: 0,
    monthly_variable_revenue_amt_year1: 0,
    monthly_variable_revenue_amt_fy2026: 0,
    monthly_variable_revenue_amt_contract: 0,
    transport_value_added_revenue_year1: 0,
    transport_value_added_revenue_fy2026: 0,
    transport_value_added_revenue_contract: 0,
    total_revenue_year1: 0,
    total_revenue_fy2026: 0,
    total_revenue_contract: 0,
    yoy_escalation_percent: 0,
    go_live_date: null
  });

  const createDefaultBARates = (): OBFBARates => ({
    obf_id: obfId,
    warehouse_rent_qty: 0,
    warehouse_rent_rate: 0,
    warehouse_rent_amt_year1: 0,
    warehouse_rent_amt_fy2026: 0,
    warehouse_rent_amt_contract: 0,
    manpower_cost_mgmt_qty: 0,
    manpower_cost_mgmt_rate: 0,
    manpower_cost_mgmt_amt_year1: 0,
    manpower_cost_mgmt_amt_fy2026: 0,
    manpower_cost_mgmt_amt_contract: 0,
    manpower_cost_min_wage_qty: 0,
    manpower_cost_min_wage_rate: 0,
    manpower_cost_min_wage_amt_year1: 0,
    manpower_cost_min_wage_amt_fy2026: 0,
    manpower_cost_min_wage_amt_contract: 0,
    consumables_qty: 0,
    consumables_rate: 0,
    consumables_amt_year1: 0,
    consumables_amt_fy2026: 0,
    consumables_amt_contract: 0,
    one_time_ammortised_cost_qty: 0,
    one_time_ammortised_cost_rate: 0,
    one_time_ammortised_cost_amt_year1: 0,
    one_time_ammortised_cost_amt_fy2026: 0,
    one_time_ammortised_cost_amt_contract: 0,
    capex_write_off_qty: 0,
    capex_write_off_rate: 0,
    capex_write_off_amt_year1: 0,
    capex_write_off_amt_fy2026: 0,
    capex_write_off_amt_contract: 0,
    one_time_ammortised_cost_impl_qty: 0,
    one_time_ammortised_cost_impl_rate: 0,
    one_time_ammortised_cost_impl_amt_year1: 0,
    one_time_ammortised_cost_impl_amt_fy2026: 0,
    one_time_ammortised_cost_impl_amt_contract: 0,
    total_ba_cost_year1: 0,
    total_ba_cost_fy2026: 0,
    total_ba_cost_contract: 0,
    yoy_escalation_percent: 0
  });

  const createDefaultDirectExpenses = (): OBFDirectExpenses => ({
    obf_id: obfId,
    transport_cost_qty: 0,
    transport_cost_rate: 0,
    transport_cost_amt_year1: 0,
    transport_cost_amt_fy2026: 0,
    transport_cost_amt_contract: 0,
    transport_manpower_cost_qty: 0,
    transport_manpower_cost_rate: 0,
    transport_manpower_cost_amt_year1: 0,
    transport_manpower_cost_amt_fy2026: 0,
    transport_manpower_cost_amt_contract: 0,
    gps_ct_running_expenses_qty: 0,
    gps_ct_running_expenses_rate: 0,
    gps_ct_running_expenses_amt_year1: 0,
    gps_ct_running_expenses_amt_fy2026: 0,
    gps_ct_running_expenses_amt_contract: 0,
    total_direct_expenses_year1: 0,
    total_direct_expenses_fy2026: 0,
    total_direct_expenses_contract: 0,
    yoy_escalation_percent: 0
  });

  const createDefaultFinancialMetrics = (): OBFFinancialMetrics => ({
    obf_id: obfId,
    gross_margin_year1: 0,
    gross_margin_fy2026: 0,
    gross_margin_contract: 0,
    gross_percent_year1: 0,
    gross_percent_fy2026: 0,
    gross_percent_contract: 0,
    trade_discount_year1: 0,
    trade_discount_fy2026: 0,
    trade_discount_contract: 0,
    gross_margin_after_discount_year1: 0,
    gross_margin_after_discount_fy2026: 0,
    gross_margin_after_discount_contract: 0,
    gross_margin_after_discount_percent_year1: 0,
    gross_margin_after_discount_percent_fy2026: 0,
    gross_margin_after_discount_percent_contract: 0,
    depreciation_ammortisation_year1: 0,
    depreciation_ammortisation_fy2026: 0,
    depreciation_ammortisation_contract: 0,
    ebit_year1: 0,
    ebit_fy2026: 0,
    ebit_contract: 0,
    ebit_percent_year1: 0,
    ebit_percent_fy2026: 0,
    ebit_percent_contract: 0,
    interest_cost_year1: 0,
    interest_cost_fy2026: 0,
    interest_cost_contract: 0,
    ebt_year1: 0,
    ebt_fy2026: 0,
    ebt_contract: 0,
    ebt_percent_year1: 0,
    ebt_percent_fy2026: 0,
    ebt_percent_contract: 0
  });

  // Update values based on user input
  const updateRevenueField = (field: keyof OBFRevenue, value: number | string) => {
    if (!revenue) return;
    
    const updatedRevenue = { ...revenue, [field]: value };
    
    // If changing quantities, rates, YOY escalation, or go_live_date, recalculate all amounts immediately
    if (field.includes('_qty') || field.includes('_rate') || field === 'yoy_escalation_percent' || field === 'go_live_date') {
      // Calculate amounts for fixed revenue
      const fixedAmounts = calculateAmounts(
        updatedRevenue.monthly_fixed_revenue_qty,
        updatedRevenue.monthly_fixed_revenue_rate,
        updatedRevenue.go_live_date,
        safeProjectPeriod,
        updatedRevenue.yoy_escalation_percent
      );
      
      updatedRevenue.monthly_fixed_revenue_amt_year1 = fixedAmounts.year1;
      updatedRevenue.monthly_fixed_revenue_amt_fy2026 = fixedAmounts.fy2026;
      updatedRevenue.monthly_fixed_revenue_amt_contract = fixedAmounts.contract;
      
      // Calculate amounts for variable revenue
      const variableAmounts = calculateAmounts(
        updatedRevenue.monthly_variable_revenue_qty,
        updatedRevenue.monthly_variable_revenue_rate,
        updatedRevenue.go_live_date,
        safeProjectPeriod,
        updatedRevenue.yoy_escalation_percent
      );
      
      updatedRevenue.monthly_variable_revenue_amt_year1 = variableAmounts.year1;
      updatedRevenue.monthly_variable_revenue_amt_fy2026 = variableAmounts.fy2026;
      updatedRevenue.monthly_variable_revenue_amt_contract = variableAmounts.contract;
    }
    
    // Calculate totals
    updatedRevenue.total_revenue_year1 = 
      Number(updatedRevenue.monthly_fixed_revenue_amt_year1) +
      Number(updatedRevenue.monthly_variable_revenue_amt_year1) +
      Number(updatedRevenue.transport_value_added_revenue_year1);
    
    updatedRevenue.total_revenue_fy2026 = 
      Number(updatedRevenue.monthly_fixed_revenue_amt_fy2026) +
      Number(updatedRevenue.monthly_variable_revenue_amt_fy2026) +
      Number(updatedRevenue.transport_value_added_revenue_fy2026);
    
    updatedRevenue.total_revenue_contract = 
      Number(updatedRevenue.monthly_fixed_revenue_amt_contract) +
      Number(updatedRevenue.monthly_variable_revenue_amt_contract) +
      Number(updatedRevenue.transport_value_added_revenue_contract);
    
    setRevenue(updatedRevenue);
  };

  const updateBARatesField = (field: keyof OBFBARates, value: number) => {
    if (!baRates || !revenue) return;
    
    const updatedBARates = { ...baRates, [field]: value };
    
    // If changing quantities, rates, or YOY escalation, recalculate all amounts immediately
    if (field.includes('_qty') || field.includes('_rate') || field === 'yoy_escalation_percent') {
      // Calculate amounts for each BA rate component
      const warehouseAmounts = calculateAmounts(
        updatedBARates.warehouse_rent_qty,
        updatedBARates.warehouse_rent_rate,
        revenue.go_live_date,
        safeProjectPeriod,
        updatedBARates.yoy_escalation_percent
      );
      
      updatedBARates.warehouse_rent_amt_year1 = warehouseAmounts.year1;
      updatedBARates.warehouse_rent_amt_fy2026 = warehouseAmounts.fy2026;
      updatedBARates.warehouse_rent_amt_contract = warehouseAmounts.contract;
      
      // Calculate amounts for manpower management
      const mgmtAmounts = calculateAmounts(
        updatedBARates.manpower_cost_mgmt_qty,
        updatedBARates.manpower_cost_mgmt_rate,
        revenue.go_live_date,
        safeProjectPeriod,
        updatedBARates.yoy_escalation_percent
      );
      
      updatedBARates.manpower_cost_mgmt_amt_year1 = mgmtAmounts.year1;
      updatedBARates.manpower_cost_mgmt_amt_fy2026 = mgmtAmounts.fy2026;
      updatedBARates.manpower_cost_mgmt_amt_contract = mgmtAmounts.contract;
      
      // Calculate amounts for minimum wage manpower
      const minWageAmounts = calculateAmounts(
        updatedBARates.manpower_cost_min_wage_qty,
        updatedBARates.manpower_cost_min_wage_rate,
        revenue.go_live_date,
        safeProjectPeriod,
        updatedBARates.yoy_escalation_percent
      );
      
      updatedBARates.manpower_cost_min_wage_amt_year1 = minWageAmounts.year1;
      updatedBARates.manpower_cost_min_wage_amt_fy2026 = minWageAmounts.fy2026;
      updatedBARates.manpower_cost_min_wage_amt_contract = minWageAmounts.contract;
      
      // Calculate amounts for consumables
      const consumablesAmounts = calculateAmounts(
        updatedBARates.consumables_qty,
        updatedBARates.consumables_rate,
        revenue.go_live_date,
        safeProjectPeriod,
        updatedBARates.yoy_escalation_percent
      );
      
      updatedBARates.consumables_amt_year1 = consumablesAmounts.year1;
      updatedBARates.consumables_amt_fy2026 = consumablesAmounts.fy2026;
      updatedBARates.consumables_amt_contract = consumablesAmounts.contract;
      
      // Calculate amounts for one-time amortized cost
      const oneTimeAmounts = calculateAmounts(
        updatedBARates.one_time_ammortised_cost_qty,
        updatedBARates.one_time_ammortised_cost_rate,
        revenue.go_live_date,
        safeProjectPeriod,
        updatedBARates.yoy_escalation_percent
      );
      
      updatedBARates.one_time_ammortised_cost_amt_year1 = oneTimeAmounts.year1;
      updatedBARates.one_time_ammortised_cost_amt_fy2026 = oneTimeAmounts.fy2026;
      updatedBARates.one_time_ammortised_cost_amt_contract = oneTimeAmounts.contract;
      
      // Calculate amounts for CAPEX write-off
      const capexAmounts = calculateAmounts(
        updatedBARates.capex_write_off_qty,
        updatedBARates.capex_write_off_rate,
        revenue.go_live_date,
        safeProjectPeriod,
        updatedBARates.yoy_escalation_percent
      );
      
      updatedBARates.capex_write_off_amt_year1 = capexAmounts.year1;
      updatedBARates.capex_write_off_amt_fy2026 = capexAmounts.fy2026;
      updatedBARates.capex_write_off_amt_contract = capexAmounts.contract;
      
      // Calculate amounts for implementation cost
      const implAmounts = calculateAmounts(
        updatedBARates.one_time_ammortised_cost_impl_qty,
        updatedBARates.one_time_ammortised_cost_impl_rate,
        revenue.go_live_date,
        safeProjectPeriod,
        updatedBARates.yoy_escalation_percent
      );
      
      updatedBARates.one_time_ammortised_cost_impl_amt_year1 = implAmounts.year1;
      updatedBARates.one_time_ammortised_cost_impl_amt_fy2026 = implAmounts.fy2026;
      updatedBARates.one_time_ammortised_cost_impl_amt_contract = implAmounts.contract;
      
      // Calculate totals
      updatedBARates.total_ba_cost_year1 = 
        (updatedBARates.warehouse_rent_amt_year1 ?? 0) +
        (updatedBARates.manpower_cost_mgmt_amt_year1 ?? 0) +
        (updatedBARates.manpower_cost_min_wage_amt_year1 ?? 0) +
        (updatedBARates.consumables_amt_year1 ?? 0) +
        (updatedBARates.one_time_ammortised_cost_amt_year1 ?? 0) +
        (updatedBARates.capex_write_off_amt_year1 ?? 0) +
        (updatedBARates.one_time_ammortised_cost_impl_amt_year1 ?? 0);
      
      updatedBARates.total_ba_cost_fy2026 = 
        (updatedBARates.warehouse_rent_amt_fy2026 ?? 0) +
        (updatedBARates.manpower_cost_mgmt_amt_fy2026 ?? 0) +
        (updatedBARates.manpower_cost_min_wage_amt_fy2026 ?? 0) +
        (updatedBARates.consumables_amt_fy2026 ?? 0) +
        (updatedBARates.one_time_ammortised_cost_amt_fy2026 ?? 0) +
        (updatedBARates.capex_write_off_amt_fy2026 ?? 0) +
        (updatedBARates.one_time_ammortised_cost_impl_amt_fy2026 ?? 0);
      
      updatedBARates.total_ba_cost_contract = 
        (updatedBARates.warehouse_rent_amt_contract ?? 0) +
        (updatedBARates.manpower_cost_mgmt_amt_contract ?? 0) +
        (updatedBARates.manpower_cost_min_wage_amt_contract ?? 0) +
        (updatedBARates.consumables_amt_contract ?? 0) +
        (updatedBARates.one_time_ammortised_cost_amt_contract ?? 0) +
        (updatedBARates.capex_write_off_amt_contract ?? 0) +
        (updatedBARates.one_time_ammortised_cost_impl_amt_contract ?? 0);
    }
    
    setBARates(updatedBARates);
  };

  const updateDirectExpensesField = (field: keyof OBFDirectExpenses, value: number) => {
    if (!directExpenses || !revenue) return;
    
    const updatedDirectExpenses = { ...directExpenses, [field]: value };
    
    // If changing quantities, rates, or YOY escalation, recalculate all amounts immediately
    if (field.includes('_qty') || field.includes('_rate') || field === 'yoy_escalation_percent') {
      // Calculate amounts for transport cost
      const transportAmounts = calculateAmounts(
        updatedDirectExpenses.transport_cost_qty,
        updatedDirectExpenses.transport_cost_rate,
        revenue.go_live_date,
        safeProjectPeriod,
        updatedDirectExpenses.yoy_escalation_percent
      );
      
      updatedDirectExpenses.transport_cost_amt_year1 = transportAmounts.year1;
      updatedDirectExpenses.transport_cost_amt_fy2026 = transportAmounts.fy2026;
      updatedDirectExpenses.transport_cost_amt_contract = transportAmounts.contract;
      
      // Calculate amounts for transport manpower cost
      const manpowerAmounts = calculateAmounts(
        updatedDirectExpenses.transport_manpower_cost_qty,
        updatedDirectExpenses.transport_manpower_cost_rate,
        revenue.go_live_date,
        safeProjectPeriod,
        updatedDirectExpenses.yoy_escalation_percent
      );
      
      updatedDirectExpenses.transport_manpower_cost_amt_year1 = manpowerAmounts.year1;
      updatedDirectExpenses.transport_manpower_cost_amt_fy2026 = manpowerAmounts.fy2026;
      updatedDirectExpenses.transport_manpower_cost_amt_contract = manpowerAmounts.contract;
      
      // Calculate amounts for GPS/CT running expenses
      const gpsAmounts = calculateAmounts(
        updatedDirectExpenses.gps_ct_running_expenses_qty,
        updatedDirectExpenses.gps_ct_running_expenses_rate,
        revenue.go_live_date,
        safeProjectPeriod,
        updatedDirectExpenses.yoy_escalation_percent
      );
      
      updatedDirectExpenses.gps_ct_running_expenses_amt_year1 = gpsAmounts.year1;
      updatedDirectExpenses.gps_ct_running_expenses_amt_fy2026 = gpsAmounts.fy2026;
      updatedDirectExpenses.gps_ct_running_expenses_amt_contract = gpsAmounts.contract;
      
      // Calculate totals
      updatedDirectExpenses.total_direct_expenses_year1 = 
        (updatedDirectExpenses.transport_cost_amt_year1 ?? 0) +
        (updatedDirectExpenses.transport_manpower_cost_amt_year1 ?? 0) +
        (updatedDirectExpenses.gps_ct_running_expenses_amt_year1 ?? 0);
      
      updatedDirectExpenses.total_direct_expenses_fy2026 = 
        (updatedDirectExpenses.transport_cost_amt_fy2026 ?? 0) +
        (updatedDirectExpenses.transport_manpower_cost_amt_fy2026 ?? 0) +
        (updatedDirectExpenses.gps_ct_running_expenses_amt_fy2026 ?? 0);
      
      updatedDirectExpenses.total_direct_expenses_contract = 
        (updatedDirectExpenses.transport_cost_amt_contract ?? 0) +
        (updatedDirectExpenses.transport_manpower_cost_amt_contract ?? 0) +
        (updatedDirectExpenses.gps_ct_running_expenses_amt_contract ?? 0);
    }
    
    setDirectExpenses(updatedDirectExpenses);
  };

  const updateFinancialMetricsField = (field: keyof OBFFinancialMetrics, value: number) => {
    if (!financialMetrics || !revenue || !baRates || !directExpenses) return;
    
    const updatedMetrics = { ...financialMetrics, [field]: value };
    
    // Calculate updated financial metrics
    // Gross margin calculation (A - B - C)
    const grossMarginYear1 = Number(((revenue.total_revenue_year1 ?? 0) - (baRates.total_ba_cost_year1 ?? 0) - (directExpenses.total_direct_expenses_year1 ?? 0)).toFixed(2));
    const grossMarginFy2026 = Number(((revenue.total_revenue_fy2026 ?? 0) - (baRates.total_ba_cost_fy2026 ?? 0) - (directExpenses.total_direct_expenses_fy2026 ?? 0)).toFixed(2));
    const grossMarginContract = Number(((revenue.total_revenue_contract ?? 0) - (baRates.total_ba_cost_contract ?? 0) - (directExpenses.total_direct_expenses_contract ?? 0)).toFixed(2));
    
    updatedMetrics.gross_margin_year1 = grossMarginYear1;
    updatedMetrics.gross_margin_fy2026 = grossMarginFy2026;
    updatedMetrics.gross_margin_contract = grossMarginContract;
    
    // Gross percentage calculation
    updatedMetrics.gross_percent_year1 = (revenue.total_revenue_year1 ?? 0) !== 0 
      ? Number(((grossMarginYear1 / (revenue.total_revenue_year1 ?? 0)) * 100).toFixed(2))
      : 0;
    
    updatedMetrics.gross_percent_fy2026 = (revenue.total_revenue_fy2026 ?? 0) !== 0 
      ? Number(((grossMarginFy2026 / (revenue.total_revenue_fy2026 ?? 0)) * 100).toFixed(2))
      : 0;
    
    updatedMetrics.gross_percent_contract = (revenue.total_revenue_contract ?? 0) !== 0 
      ? Number(((grossMarginContract / (revenue.total_revenue_contract ?? 0)) * 100).toFixed(2))
      : 0;
    
    // Gross margin after discount calculation (D + E)
    const gmadYear1 = Number((grossMarginYear1 + (updatedMetrics.trade_discount_year1 ?? 0)).toFixed(2));
    const gmadFy2026 = Number((grossMarginFy2026 + (updatedMetrics.trade_discount_fy2026 ?? 0)).toFixed(2));
    const gmadContract = Number((grossMarginContract + (updatedMetrics.trade_discount_contract ?? 0)).toFixed(2));
    
    updatedMetrics.gross_margin_after_discount_year1 = gmadYear1;
    updatedMetrics.gross_margin_after_discount_fy2026 = gmadFy2026;
    updatedMetrics.gross_margin_after_discount_contract = gmadContract;
    
    // Gross margin after discount percentage calculation
    updatedMetrics.gross_margin_after_discount_percent_year1 = (revenue.total_revenue_year1 ?? 0) !== 0 
      ? Number(((gmadYear1 / (revenue.total_revenue_year1 ?? 0)) * 100).toFixed(2))
      : 0;
    
    updatedMetrics.gross_margin_after_discount_percent_fy2026 = (revenue.total_revenue_fy2026 ?? 0) !== 0 
      ? Number(((gmadFy2026 / (revenue.total_revenue_fy2026 ?? 0)) * 100).toFixed(2))
      : 0;
    
    updatedMetrics.gross_margin_after_discount_percent_contract = (revenue.total_revenue_contract ?? 0) !== 0 
      ? Number(((gmadContract / (revenue.total_revenue_contract ?? 0)) * 100).toFixed(2))
      : 0;
    
    // EBIT calculation (D+E - Depreciation/Amortization)
    const ebitYear1 = Number((gmadYear1 - (updatedMetrics.depreciation_ammortisation_year1 ?? 0)).toFixed(2));
    const ebitFy2026 = Number((gmadFy2026 - (updatedMetrics.depreciation_ammortisation_fy2026 ?? 0)).toFixed(2));
    const ebitContract = Number((gmadContract - (updatedMetrics.depreciation_ammortisation_contract ?? 0)).toFixed(2));
    
    updatedMetrics.ebit_year1 = ebitYear1;
    updatedMetrics.ebit_fy2026 = ebitFy2026;
    updatedMetrics.ebit_contract = ebitContract;
    
    // EBIT percentage calculation
    updatedMetrics.ebit_percent_year1 = (revenue.total_revenue_year1 ?? 0) !== 0 
      ? Number(((ebitYear1 / (revenue.total_revenue_year1 ?? 0)) * 100).toFixed(2))
      : 0;
    
    updatedMetrics.ebit_percent_fy2026 = (revenue.total_revenue_fy2026 ?? 0) !== 0 
      ? Number(((ebitFy2026 / (revenue.total_revenue_fy2026 ?? 0)) * 100).toFixed(2))
      : 0;
    
    updatedMetrics.ebit_percent_contract = (revenue.total_revenue_contract ?? 0) !== 0 
      ? Number(((ebitContract / (revenue.total_revenue_contract ?? 0)) * 100).toFixed(2))
      : 0;
    
    // EBT calculation (EBIT - Interest Cost)
    const ebtYear1 = Number((ebitYear1 - (updatedMetrics.interest_cost_year1 ?? 0)).toFixed(2));
    const ebtFy2026 = Number((ebitFy2026 - (updatedMetrics.interest_cost_fy2026 ?? 0)).toFixed(2));
    const ebtContract = Number((ebitContract - (updatedMetrics.interest_cost_contract ?? 0)).toFixed(2));
    
    updatedMetrics.ebt_year1 = ebtYear1;
    updatedMetrics.ebt_fy2026 = ebtFy2026;
    updatedMetrics.ebt_contract = ebtContract;
    
    // EBT percentage calculation
    updatedMetrics.ebt_percent_year1 = (revenue.total_revenue_year1 ?? 0) !== 0 
      ? Number(((ebtYear1 / (revenue.total_revenue_year1 ?? 0)) * 100).toFixed(2))
      : 0;
    
    updatedMetrics.ebt_percent_fy2026 = (revenue.total_revenue_fy2026 ?? 0) !== 0 
      ? Number(((ebtFy2026 / (revenue.total_revenue_fy2026 ?? 0)) * 100).toFixed(2))
      : 0;
    
    updatedMetrics.ebt_percent_contract = (revenue.total_revenue_contract ?? 0) !== 0 
      ? Number(((ebtContract / (revenue.total_revenue_contract ?? 0)) * 100).toFixed(2))
      : 0;
    
    setFinancialMetrics(updatedMetrics);
  };

  // Save all data to the API
  const saveAllData = async () => {
    try {
      setSaving(true);
      await Promise.all([
        obfWorkingService.saveRevenue(obfId, revenue),
        obfWorkingService.saveBARates(obfId, baRates),
        obfWorkingService.saveDirectExpenses(obfId, directExpenses),
        obfWorkingService.saveFinancialMetrics(obfId, financialMetrics)
      ]);
      toast.success("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  // Loading indicator
  if (loading) {
    return (
      <OBFWorkflow id={obfId} currentStep="working">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Image src="/Loading/newpreeload.gif" unoptimized alt="Loading..." width={150} height={150} priority />
          <div className="mt-4 text-lg text-gray-500">Loading...</div>
        </div>
      </OBFWorkflow>
    );
  }

  return (
    <OBFWorkflow id={obfId} currentStep="working">
      <div className="">
        <Card className="shadow-md">
          <CardHeader className="border-b pb-4 mb-4">
            <CardTitle className="text-2xl font-bold">OBF Working Sheet</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Customer Rates, Revenue, BA Rates, Direct Expenses, and Financial Metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10">
            {/* Go Live Date Section */}
            <section>
              <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2 mb-4">Go Live Date</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {revenue && (
                      <>
                        {renderGoLiveDateRow(
                          revenue.go_live_date,
                          (val) => updateRevenueField('go_live_date', val)
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Revenue Section */}
            <section>
              <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2 mb-4">Revenue - Warehousing OR Store Line Feed Services</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="text-left px-2 py-2">Particulars</th>
                      <th className="text-center px-2 py-2">Qty</th>
                      <th className="text-center px-2 py-2">Rate</th>
                      <th className="text-center px-2 py-2">Year 1 Amt</th>
                      <th className="text-center px-2 py-2">FY-2026 Amt</th>
                      <th className="text-center px-2 py-2">Contract Period Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenue && (
                      <>
                        {renderRowWithQtyRateAmt(
                          "Monthly Fixed Revenue",
                          revenue.monthly_fixed_revenue_qty,
                          (val) => updateRevenueField('monthly_fixed_revenue_qty', val),
                          revenue.monthly_fixed_revenue_rate,
                          (val) => updateRevenueField('monthly_fixed_revenue_rate', val),
                          revenue.monthly_fixed_revenue_amt_year1,
                          revenue.monthly_fixed_revenue_amt_fy2026,
                          revenue.monthly_fixed_revenue_amt_contract
                        )}
                        {renderRowWithQtyRateAmt(
                          "Monthly Variable Revenue",
                          revenue.monthly_variable_revenue_qty,
                          (val) => updateRevenueField('monthly_variable_revenue_qty', val),
                          revenue.monthly_variable_revenue_rate,
                          (val) => updateRevenueField('monthly_variable_revenue_rate', val),
                          revenue.monthly_variable_revenue_amt_year1,
                          revenue.monthly_variable_revenue_amt_fy2026,
                          revenue.monthly_variable_revenue_amt_contract
                        )}
                        {renderValueAddedRow(
                          "Revenue - Transport OR Value Added Services",
                          revenue.transport_value_added_revenue_year1,
                          (val) => updateRevenueField('transport_value_added_revenue_year1', val),
                          revenue.transport_value_added_revenue_fy2026,
                          (val) => updateRevenueField('transport_value_added_revenue_fy2026', val),
                          revenue.transport_value_added_revenue_contract,
                          (val) => updateRevenueField('transport_value_added_revenue_contract', val)
                        )}
                        {renderTotalRow(
                          "Total Revenue (A)",
                          revenue.total_revenue_year1,
                          revenue.total_revenue_fy2026,
                          revenue.total_revenue_contract
                        )}
                        {renderYOYEscalationRow(
                          "YOY Escalation",
                          revenue.yoy_escalation_percent,
                          (val) => updateRevenueField('yoy_escalation_percent', val)
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* BA Rates Section */}
            <section>
              <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2 mb-4">BA Rates - Particulars - with brief details</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="text-left px-2 py-2">Particulars</th>
                      <th className="text-center px-2 py-2">Qty</th>
                      <th className="text-center px-2 py-2">Rate</th>
                      <th className="text-center px-2 py-2">Year 1 Amt</th>
                      <th className="text-center px-2 py-2">FY-2026 Amt</th>
                      <th className="text-center px-2 py-2">Contract Period Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {baRates && (
                      <>
                        {renderRowWithQtyRateAmt(
                          "Warehouse Rent",
                          baRates.warehouse_rent_qty,
                          (val) => updateBARatesField('warehouse_rent_qty', val),
                          baRates.warehouse_rent_rate,
                          (val) => updateBARatesField('warehouse_rent_rate', val),
                          baRates.warehouse_rent_amt_year1,
                          baRates.warehouse_rent_amt_fy2026,
                          baRates.warehouse_rent_amt_contract
                        )}
                        {renderRowWithQtyRateAmt(
                          "Manpower Cost (Mgmt / Supervisory Category)",
                          baRates.manpower_cost_mgmt_qty,
                          (val) => updateBARatesField('manpower_cost_mgmt_qty', val),
                          baRates.manpower_cost_mgmt_rate,
                          (val) => updateBARatesField('manpower_cost_mgmt_rate', val),
                          baRates.manpower_cost_mgmt_amt_year1,
                          baRates.manpower_cost_mgmt_amt_fy2026,
                          baRates.manpower_cost_mgmt_amt_contract
                        )}
                        {renderRowWithQtyRateAmt(
                          "Manpower Cost (Min Wage Category)",
                          baRates.manpower_cost_min_wage_qty,
                          (val) => updateBARatesField('manpower_cost_min_wage_qty', val),
                          baRates.manpower_cost_min_wage_rate,
                          (val) => updateBARatesField('manpower_cost_min_wage_rate', val),
                          baRates.manpower_cost_min_wage_amt_year1,
                          baRates.manpower_cost_min_wage_amt_fy2026,
                          baRates.manpower_cost_min_wage_amt_contract
                        )}
                        {renderRowWithQtyRateAmt(
                          "Consumables",
                          baRates.consumables_qty,
                          (val) => updateBARatesField('consumables_qty', val),
                          baRates.consumables_rate,
                          (val) => updateBARatesField('consumables_rate', val),
                          baRates.consumables_amt_year1,
                          baRates.consumables_amt_fy2026,
                          baRates.consumables_amt_contract
                        )}
                        {renderRowWithQtyRateAmt(
                          "One Time Ammortised Cost (Brokerage + Pre Go Live Rental + Reg + Stamp duty)",
                          baRates.one_time_ammortised_cost_qty,
                          (val) => updateBARatesField('one_time_ammortised_cost_qty', val),
                          baRates.one_time_ammortised_cost_rate,
                          (val) => updateBARatesField('one_time_ammortised_cost_rate', val),
                          baRates.one_time_ammortised_cost_amt_year1,
                          baRates.one_time_ammortised_cost_amt_fy2026,
                          baRates.one_time_ammortised_cost_amt_contract
                        )}
                        {renderRowWithQtyRateAmt(
                          "CAPEX Write-off (for Per Unit cost less than ₹ 5000)",
                          baRates.capex_write_off_qty,
                          (val) => updateBARatesField('capex_write_off_qty', val),
                          baRates.capex_write_off_rate,
                          (val) => updateBARatesField('capex_write_off_rate', val),
                          baRates.capex_write_off_amt_year1,
                          baRates.capex_write_off_amt_fy2026,
                          baRates.capex_write_off_amt_contract
                        )}
                        {renderRowWithQtyRateAmt(
                          "One Time Ammortised Cost (Imple.)",
                          baRates.one_time_ammortised_cost_impl_qty,
                          (val) => updateBARatesField('one_time_ammortised_cost_impl_qty', val),
                          baRates.one_time_ammortised_cost_impl_rate,
                          (val) => updateBARatesField('one_time_ammortised_cost_impl_rate', val),
                          baRates.one_time_ammortised_cost_impl_amt_year1,
                          baRates.one_time_ammortised_cost_impl_amt_fy2026,
                          baRates.one_time_ammortised_cost_impl_amt_contract
                        )}
                        {renderTotalRow(
                          "Total BA Cost (B)",
                          baRates.total_ba_cost_year1,
                          baRates.total_ba_cost_fy2026,
                          baRates.total_ba_cost_contract
                        )}
                        {renderYOYEscalationRow(
                          "YOY Escalation",
                          baRates.yoy_escalation_percent,
                          (val) => updateBARatesField('yoy_escalation_percent', val)
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Direct Expenses Section */}
            <section>
              <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2 mb-4">Other Direct Expenses</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="text-left px-2 py-2">Particulars</th>
                      <th className="text-center px-2 py-2">Qty</th>
                      <th className="text-center px-2 py-2">Rate</th>
                      <th className="text-center px-2 py-2">Year 1 Amt</th>
                      <th className="text-center px-2 py-2">FY-2026 Amt</th>
                      <th className="text-center px-2 py-2">Contract Period Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {directExpenses && (
                      <>
                        {renderRowWithQtyRateAmt(
                          "Transport Cost",
                          directExpenses.transport_cost_qty,
                          (val) => updateDirectExpensesField('transport_cost_qty', val),
                          directExpenses.transport_cost_rate,
                          (val) => updateDirectExpensesField('transport_cost_rate', val),
                          directExpenses.transport_cost_amt_year1,
                          directExpenses.transport_cost_amt_fy2026,
                          directExpenses.transport_cost_amt_contract
                        )}
                        {renderRowWithQtyRateAmt(
                          "Transport Manpower Cost",
                          directExpenses.transport_manpower_cost_qty,
                          (val) => updateDirectExpensesField('transport_manpower_cost_qty', val),
                          directExpenses.transport_manpower_cost_rate,
                          (val) => updateDirectExpensesField('transport_manpower_cost_rate', val),
                          directExpenses.transport_manpower_cost_amt_year1,
                          directExpenses.transport_manpower_cost_amt_fy2026,
                          directExpenses.transport_manpower_cost_amt_contract
                        )}
                        {renderRowWithQtyRateAmt(
                          "GPS + CT + Running expenses",
                          directExpenses.gps_ct_running_expenses_qty,
                          (val) => updateDirectExpensesField('gps_ct_running_expenses_qty', val),
                          directExpenses.gps_ct_running_expenses_rate,
                          (val) => updateDirectExpensesField('gps_ct_running_expenses_rate', val),
                          directExpenses.gps_ct_running_expenses_amt_year1,
                          directExpenses.gps_ct_running_expenses_amt_fy2026,
                          directExpenses.gps_ct_running_expenses_amt_contract
                        )}
                        {renderTotalRow(
                          "Total Other Direct Expenses (C)",
                          directExpenses.total_direct_expenses_year1,
                          directExpenses.total_direct_expenses_fy2026,
                          directExpenses.total_direct_expenses_contract
                        )}
                        {renderYOYEscalationRow(
                          "YOY Escalation",
                          directExpenses.yoy_escalation_percent,
                          (val) => updateDirectExpensesField('yoy_escalation_percent', val)
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Financial Metrics Section */}
            <section>
              <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2 mb-4">Financial Metrics</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left px-2 py-2 w-1/3">Metric</th>
                      <th className="text-center px-2 py-2 w-1/5">Year 1</th>
                      <th className="text-center px-2 py-2 w-1/5">FY-2026</th>
                      <th className="text-center px-2 py-2 w-1/5">Contract Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialMetrics && (
                      <>
                        {renderMetricCalc(
                          "Gross Margin (D = A - B - C)",
                          financialMetrics.gross_margin_year1,
                          financialMetrics.gross_margin_fy2026,
                          financialMetrics.gross_margin_contract
                        )}
                        {renderMetricCalc(
                          "Gross %",
                          financialMetrics.gross_percent_year1,
                          financialMetrics.gross_percent_fy2026,
                          financialMetrics.gross_percent_contract,
                          true
                        )}
                        {renderMetricInput(
                          "Trade Discount (E)",
                          financialMetrics.trade_discount_year1,
                          (val) => updateFinancialMetricsField('trade_discount_year1', val),
                          financialMetrics.trade_discount_fy2026,
                          (val) => updateFinancialMetricsField('trade_discount_fy2026', val),
                          financialMetrics.trade_discount_contract,
                          (val) => updateFinancialMetricsField('trade_discount_contract', val)
                        )}
                        {renderMetricCalc(
                          "Gross Margin After Bill Discounting (D+E)",
                          financialMetrics.gross_margin_after_discount_year1,
                          financialMetrics.gross_margin_after_discount_fy2026,
                          financialMetrics.gross_margin_after_discount_contract
                        )}
                        {renderMetricCalc(
                          "Gross Margin After Bill Discounting %",
                          financialMetrics.gross_margin_after_discount_percent_year1,
                          financialMetrics.gross_margin_after_discount_percent_fy2026,
                          financialMetrics.gross_margin_after_discount_percent_contract,
                          true
                        )}
                        {renderMetricInput(
                          "Depreciation / Amortisation Cost",
                          financialMetrics.depreciation_ammortisation_year1,
                          (val) => updateFinancialMetricsField('depreciation_ammortisation_year1', val),
                          financialMetrics.depreciation_ammortisation_fy2026,
                          (val) => updateFinancialMetricsField('depreciation_ammortisation_fy2026', val),
                          financialMetrics.depreciation_ammortisation_contract,
                          (val) => updateFinancialMetricsField('depreciation_ammortisation_contract', val)
                        )}
                        {renderMetricCalc(
                          "EBIT (Earning Before Interest, Tax)",
                          financialMetrics.ebit_year1,
                          financialMetrics.ebit_fy2026,
                          financialMetrics.ebit_contract
                        )}
                        {renderMetricCalc(
                          "EBIT %",
                          financialMetrics.ebit_percent_year1,
                          financialMetrics.ebit_percent_fy2026,
                          financialMetrics.ebit_percent_contract,
                          true
                        )}
                        {renderMetricInput(
                          "Interest Cost",
                          financialMetrics.interest_cost_year1,
                          (val) => updateFinancialMetricsField('interest_cost_year1', val),
                          financialMetrics.interest_cost_fy2026,
                          (val) => updateFinancialMetricsField('interest_cost_fy2026', val),
                          financialMetrics.interest_cost_contract,
                          (val) => updateFinancialMetricsField('interest_cost_contract', val)
                        )}
                        {renderMetricCalc(
                          "EBT (Earning Before Tax)",
                          financialMetrics.ebt_year1,
                          financialMetrics.ebt_fy2026,
                          financialMetrics.ebt_contract
                        )}
                        {renderMetricCalc(
                          "EBT %",
                          financialMetrics.ebt_percent_year1,
                          financialMetrics.ebt_percent_fy2026,
                          financialMetrics.ebt_percent_contract,
                          true
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 border-t pt-6">
            <Button variant="outline" className="gap-2 w-full md:w-auto">Back</Button>
            <Button 
              className="gap-2 w-full md:w-auto"
              onClick={saveAllData}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save & Continue"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </OBFWorkflow>
  );
} 