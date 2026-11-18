'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obfService, OBF } from '../../../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Skeleton } from "../../../../components/ui/skeleton";
import { 
  ArrowLeft, 
  ArrowRight, 
  Buildings, 
  Calculator, 
  Info, 
  ChartBar, 
  Tag, 
  Clock, 
  FileText, 
  Calendar, 
  User, 
  Hash, 
  Stack, 
  MapPin, 
  Globe,
  Warning
} from "@phosphor-icons/react";
import { OBFWorkflow } from "../../../../components/OBFWorkflow";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Label } from "../../../../components/ui/label";
import { useAuth } from '../../../../contexts/AuthContext';
import { approvalService, notificationService } from '../../../../services/api';
import { NotificationsPopover } from '../../../../components/notifications-popover';

interface FinalOutput {
  // OBF fields
  project_code: string;
  project_name: string;
  opportunity_id: string;
  client_name: string;
  description: string | null;
  project_type: string;
  project_category: string;
  project_priority: string;
  project_status: string;
  created_at: string;
  creatorId: string;

  // Approval fields
  approval_status?: string;
  current_approver_role?: string;
  current_approver_user_id?: string;
  approver_name?: string;

  // Input result fields
  vertical: string;
  location: string;
  state: string;

  // Metrics
  metrics: {
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
  };
  yoyIncrease: { label: string; value: number }[];
  manpower: {
    mll: number;
    ba: number;
    security: number;
    total: number;
  };
  capex: {
    storage: number;
    mhe: number;
    facility: number;
    other: number;
  };
  oneTime: {
    rentals: number;
    rent_related: number;
    impl_cost: number;
    capex_1st_month_write_off: number;
    go_live_date: string;
  };
}

// Add validation results interface
interface ValidationResult {
  value: number;
  threshold: number;
  passed: boolean;
  needs_doa: boolean;
}

interface ValidationResponse {
  message: string;
  passed: boolean;
  needs_doa: boolean;
  results: {
    gross_margin_percent: ValidationResult;
    ebit_percent: ValidationResult;
    ebt_percent: ValidationResult;
    capex: ValidationResult;
    credit_period: ValidationResult;
  };
  thresholds: {
    vertical: string;
    project_type: string;
    gross_margin_percent_min: number;
    ebit_percent_min: number;
    ebt_percent_min: number;
    capex_min_lakhs: number;
    credit_period_days: number;
  };
}

// Import the shared statusColor helper
const statusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-[#d5233b]/20 text-[#d5233b]';
    case 'rejected': return 'bg-[#ff5630]/20 text-[#ff5630]';
    case 'submitted': return 'bg-[#006c9c]/20 text-[#006c9c]';
    case 'draft': return 'bg-[#ffd666]/40 text-[#bfa100]';
    case 'archived': return 'bg-gray-200 text-gray-500';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function FinalOutput() {
  const [finalOutput, setFinalOutput] = useState<FinalOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResponse | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<any>(null);
  const [approvalLoading, setApprovalLoading] = useState(true);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch OBF data
  const fetchObf = async () => {
    try {
      const response = await obfService.getFinalOutput(id!);
      setFinalOutput(response.data);
      // Set validation results if present
      if (response.data.validation_result) {
        try {
          const parsed = typeof response.data.validation_result === 'string'
            ? JSON.parse(response.data.validation_result)
            : response.data.validation_result;
          setValidationResults(parsed);
        } catch (e) {
          setValidationResults(null);
        }
      } else {
        setValidationResults(null);
      }

      // Set approval status from OBF data if available
      if (response.data.approval_status || response.data.current_approver_role || response.data.current_approver_user_id) {
        setApprovalStatus({
          status: response.data.approval_status || 'not_started',
          current_approver_role: response.data.current_approver_role,
          current_approver_user_id: response.data.current_approver_user_id,
          approver_name: response.data.approver_name
        });
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchObf when component mounts
  useEffect(() => {
    if (id) {
      fetchObf();
    }
  }, [id]);

  // Approval status fetcher as a named function
  const fetchApproval = async () => {
    setApprovalLoading(true);
    try {
      const res = await approvalService.getStatus(id!);
      setApprovalStatus(res.data);
      setApprovalError(null);
    } catch (e) {
      setApprovalError('Could not fetch approval status');
    } finally {
      setApprovalLoading(false);
    }
  };

  useEffect(() => {
    fetchApproval();
  }, [id]);

  // Debug log for Approve button visibility
  useEffect(() => {
    if (approvalStatus && user) {
      console.log('Approval Status:', {
        currentUser: user.id,
        approverId: approvalStatus.current_approver_user_id,
        status: approvalStatus.status,
        approverName: approvalStatus.approver_name,
        approverRole: approvalStatus.current_approver_role
      });
    }
  }, [approvalStatus, user]);

  // Separate effect for OBF status logging
  useEffect(() => {
    if (finalOutput) {
      console.log('OBF Status:', {
        projectStatus: finalOutput.project_status,
        approvalStatus: finalOutput.approval_status,
        currentApproverRole: finalOutput.current_approver_role,
        currentApproverId: finalOutput.current_approver_user_id
      });
    }
  }, [finalOutput]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationService.getAll();
        const obfNotifs = res.data.filter((n: any) => n.obf_id === id);
        setNotifications(obfNotifs);
        setUnreadCount(obfNotifs.filter((n: any) => !n.read).length);
      } catch (e) {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [id]);

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-500">Invalid OBF ID</div>
        <Button onClick={() => navigate('/obf')} className="mt-4">Return to OBF List</Button>
      </div>
    );
  }

  // Map metrics data
  const metricsData = finalOutput?.metrics
    ? [
        { label: 'Gross Margin', y1: Number(finalOutput.metrics.gross_margin_year1), fy: Number(finalOutput.metrics.gross_margin_fy2026), cp: Number(finalOutput.metrics.gross_margin_contract) },
        { label: 'Gross Margin %', y1: Number(finalOutput.metrics.gross_percent_year1), fy: Number(finalOutput.metrics.gross_percent_fy2026), cp: Number(finalOutput.metrics.gross_percent_contract) },
        { label: 'Trade Discount', y1: Number(finalOutput.metrics.trade_discount_year1), fy: Number(finalOutput.metrics.trade_discount_fy2026), cp: Number(finalOutput.metrics.trade_discount_contract) },
        { label: 'Gross Margin After Discount', y1: Number(finalOutput.metrics.gross_margin_after_discount_year1), fy: Number(finalOutput.metrics.gross_margin_after_discount_fy2026), cp: Number(finalOutput.metrics.gross_margin_after_discount_contract) },
        { label: 'Gross Margin After Discount %', y1: Number(finalOutput.metrics.gross_margin_after_discount_percent_year1), fy: Number(finalOutput.metrics.gross_margin_after_discount_percent_fy2026), cp: Number(finalOutput.metrics.gross_margin_after_discount_percent_contract) },
        { label: 'Depreciation/Amortisation', y1: Number(finalOutput.metrics.depreciation_ammortisation_year1), fy: Number(finalOutput.metrics.depreciation_ammortisation_fy2026), cp: Number(finalOutput.metrics.depreciation_ammortisation_contract) },
        { label: 'EBIT', y1: Number(finalOutput.metrics.ebit_year1), fy: Number(finalOutput.metrics.ebit_fy2026), cp: Number(finalOutput.metrics.ebit_contract) },
        { label: 'EBIT %', y1: Number(finalOutput.metrics.ebit_percent_year1), fy: Number(finalOutput.metrics.ebit_percent_fy2026), cp: Number(finalOutput.metrics.ebit_percent_contract) },
        { label: 'Interest Cost', y1: Number(finalOutput.metrics.interest_cost_year1), fy: Number(finalOutput.metrics.interest_cost_fy2026), cp: Number(finalOutput.metrics.interest_cost_contract) },
        { label: 'EBT', y1: Number(finalOutput.metrics.ebt_year1), fy: Number(finalOutput.metrics.ebt_fy2026), cp: Number(finalOutput.metrics.ebt_contract) },
        { label: 'EBT %', y1: Number(finalOutput.metrics.ebt_percent_year1), fy: Number(finalOutput.metrics.ebt_percent_fy2026), cp: Number(finalOutput.metrics.ebt_percent_contract) },
      ]
    : [];

  // Helper to safely format numbers
  const safeToFixed = (val: any, digits = 2) => {
    const num = typeof val === 'number' ? val : (typeof val === 'string' ? Number(val) : NaN);
    if (!isNaN(num)) return num.toFixed(digits);
    return '-';
  };

  // YOY Increase
  const yoyIncreaseData = finalOutput?.yoyIncrease || [];

  // Manpower
  const manpowerData = finalOutput?.manpower
    ? [
        { label: 'MLL', count: finalOutput.manpower.mll },
        { label: 'BA', count: finalOutput.manpower.ba },
        { label: 'Security', count: finalOutput.manpower.security },
      ]
    : [];
  const manpowerTotal = finalOutput?.manpower ? finalOutput.manpower.total : 0;

  // CAPEX
  const capexData = finalOutput?.capex
    ? [
        { label: 'Storage', value: Number(finalOutput.capex.storage) },
        { label: 'MHE', value: Number(finalOutput.capex.mhe) },
        { label: 'Facility', value: Number(finalOutput.capex.facility) },
        { label: 'Other', value: Number(finalOutput.capex.other) },
      ]
    : [];
  const capexTotal = capexData.reduce((sum, row) => sum + (row.value || 0), 0);

  // One Time Expenses
  const oneTimeData = finalOutput?.oneTime
    ? [
        { label: 'Rentals', value: Number(finalOutput.oneTime.rentals) },
        { label: 'Rent related', value: Number(finalOutput.oneTime.rent_related) },
        { label: 'IMPL cost', value: Number(finalOutput.oneTime.impl_cost) },
        { label: 'CAPEX 1st month write-off', value: Number(finalOutput.oneTime.capex_1st_month_write_off) },
      ]
    : [];
  const oneTimeTotal = oneTimeData.reduce((sum, row) => sum + (row.value || 0), 0);

  const handleValidate = async () => {
    try {
      setSaving(true);
      const response = await obfService.validate(id);
      const validationData = response.data as ValidationResponse;
      if (validationData.passed) {
        toast.success(validationData.message);
      } else {
        if (validationData.needs_doa) {
          toast.warning("OBF requires DOA approval");
        } else {
          toast.error(validationData.message);
        }
      }
      setValidationResults(validationData);
      // Refresh approval status and OBF/project data after validation
      await fetchApproval();
      await fetchObf();
    } catch (error) {
      console.error('Error validating OBF:', error);
      toast.error("Failed to validate OBF");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <OBFWorkflow id={id} currentStep="final">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="mt-4 text-lg text-gray-500">Loading...</div>
        </div>
      </OBFWorkflow>
    );
  }

  if (error) {
    return (
      <OBFWorkflow id={id} currentStep="final">
        <Card className="bg-amber-50 border-amber-200 text-amber-700">
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center">
              <p className="mb-4">{error}</p>
              <Button onClick={() => navigate('/obf')}>Return to OBF List</Button>
            </div>
          </CardContent>
        </Card>
      </OBFWorkflow>
    );
  }

  if (!finalOutput) {
    return (
      <OBFWorkflow id={id} currentStep="final">
        <Card className="bg-amber-50 border-amber-200 text-amber-700">
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center">
              <p className="mb-4">Data not found</p>
              <Button onClick={() => navigate('/obf')}>Return to OBF List</Button>
            </div>
          </CardContent>
        </Card>
      </OBFWorkflow>
    );
  }

  return (
    <OBFWorkflow id={id} currentStep="final">
      <Card>
        {/* <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Final Output</CardTitle>
            <CardDescription>
              Project: {finalOutput.project_name} ({finalOutput.project_code})
            </CardDescription>
          </div>
        </CardHeader> */}

        {/* Approval Flow Card */}
        <div className="px-6 pt-6 pb-6 border-b">
          <div className="">
            <div className="flex flex-col gap-2 w-full">
              <h3 className="text-lg font-semibold text-gray-900">Approval Status</h3>
              {approvalLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                  Loading approval status...
                </div>
              ) : approvalError ? (
                <div className="flex items-center gap-2 text-destructive">
                  <Warning size={20} weight="bold" />
                  {approvalError}
                </div>
              ) : approvalStatus ? (
                <div className="flex gap-2 justify-between w-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Current Status:</span>
                      <span className="text-lg font-semibold">
                        {approvalStatus.status === 'approved' ? 'Approved' : 
                         approvalStatus.status === 'pending' ? 'Pending' : 
                         approvalStatus.status === 'rejected' ? 'Rejected' : 
                         approvalStatus.status === 'not_started' ? 'Not Started' : 
                         approvalStatus.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Waiting for:</span>
                      <span className="text-base text-gray-700">
                        {approvalStatus.approver_name
                          ? `${approvalStatus.approver_name} (${approvalStatus.current_approver_role})`
                          : approvalStatus.current_approver_role || '—'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 md:items-end">
                    {approvalStatus.status === 'approved' ? (
                      <Badge variant="default" className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 text-sm font-medium">Approved</Badge>
                    ) : approvalStatus.status === 'rejected' ? (
                      <Badge variant="destructive" className="px-3 py-1 text-sm font-medium">Rejected</Badge>
                    ) : user && approvalStatus.status === 'pending' && approvalStatus.current_approver_user_id === user.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-[#d5233b] hover:bg-[#d5233b]/90 text-white px-6 py-2 font-medium"
                          onClick={async () => {
                            setApprovalLoading(true);
                            try {
                              await approvalService.approve(id);
                              toast.success('Approved!');
                              await fetchApproval();
                              await fetchObf();
                            } catch (e) {
                              toast.error('Approval failed');
                            } finally {
                              setApprovalLoading(false);
                            }
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50 px-6 py-2 font-medium"
                          onClick={async () => {
                            setApprovalLoading(true);
                            try {
                              await approvalService.reject(id);
                              toast.success('Rejected!');
                              await fetchApproval();
                              await fetchObf();
                            } catch (e) {
                              toast.error('Rejection failed');
                            } finally {
                              setApprovalLoading(false);
                            }
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={16} weight="bold" />
                        <span className="text-sm">Waiting for {approvalStatus.current_approver_role || '—'} to approve</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <CardContent className="space-y-10 mt-5">
          {/* Project Details */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-3">{finalOutput.project_name}</h1>
                  <div className="flex flex-wrap gap-4 text-foreground/80">
                    <span className="flex items-center gap-1.5">
                      <Tag size={16} weight="fill" className="" />
                      {finalOutput.project_code}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Buildings size={16} weight="fill" className="" />
                      {finalOutput.client_name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={16} weight="fill" className="" />
                      {finalOutput.created_at ? new Date(finalOutput.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
                    <FileText size={14} weight="fill" className="" />
                    {finalOutput.project_type}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
                    <Calendar size={14} weight="fill" className="" />
                    {finalOutput.project_category}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
                    <User size={14} weight="fill" className="" />
                    {finalOutput.creatorId}
                  </Badge>
                  <Badge className={`${statusColor(finalOutput.project_status || '')} px-3 py-1`}>
                    {finalOutput.project_status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Opportunity ID</Label>
                    <div className="text-sm">{finalOutput.opportunity_id || 'N/A'}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Vertical</Label>
                    <div className="text-sm">{finalOutput.vertical || 'N/A'}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Location</Label>
                    <div className="text-sm">{finalOutput.location || 'N/A'}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">State</Label>
                    <div className="text-sm">{finalOutput.state || 'N/A'}</div>
                  </div>
                </div>

                {finalOutput.description && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <div className="text-sm bg-gray-50 rounded-lg p-3">{finalOutput.description}</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Go Live Date */}
          <section>
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2 mb-4">Expected Go Live Date</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="font-medium whitespace-nowrap pr-2 py-2">Date:</td>
                    <td className="px-2 py-2">
                      <div className="bg-gray-50 rounded px-3 py-1.5">
                        {finalOutput.oneTime?.go_live_date ? new Date(finalOutput.oneTime.go_live_date).toLocaleDateString('en-IN') : 'N/A'}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Metrics Table */}
          <section>
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2 mb-4">Financial Metrics</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="text-left px-2 py-2">Metric</th>
                    <th className="text-center px-2 py-2">Year 1</th>
                    <th className="text-center px-2 py-2">FY 2026</th>
                    <th className="text-center px-2 py-2">Contract Period</th>
                  </tr>
                </thead>
                <tbody>
                  {metricsData.map((row, i) => (
                    <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="font-medium whitespace-nowrap pr-2 py-2">{row.label}</td>
                      <td className="px-2 py-2 text-right">{safeToFixed(row.y1)}</td>
                      <td className="px-2 py-2 text-right">{safeToFixed(row.fy)}</td>
                      <td className="px-2 py-2 text-right">{safeToFixed(row.cp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* YOY Increase */}
          <section>
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2 mb-4">YOY Increase</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="text-left px-2 py-2">Particulars</th>
                    <th className="text-center px-2 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {finalOutput?.yoyIncrease?.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="font-medium whitespace-nowrap pr-2 py-2">{row.label}</td>
                      <td className="px-2 py-2 text-right">{row.value}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Manpower Count */}
          <section>
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">Manpower Count</h2>
              <span className="font-medium text-[#d5233b]">Total: {finalOutput?.manpower?.total || 0}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="text-left px-2 py-2">Category</th>
                    <th className="text-center px-2 py-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {manpowerData.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="font-medium whitespace-nowrap pr-2 py-2">{row.label}</td>
                      <td className="px-2 py-2 text-right">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CAPEX */}
          <section>
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">CAPEX</h2>
              <span className="font-medium text-[#d5233b]">Total: ₹{safeToFixed(capexTotal)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="text-left px-2 py-2">Particulars</th>
                    <th className="text-center px-2 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {capexData.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="font-medium whitespace-nowrap pr-2 py-2">{row.label}</td>
                      <td className="px-2 py-2 text-right">₹{safeToFixed(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* One Time Expenses */}
          <section>
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">One Time Expenses</h2>
              <span className="font-medium text-[#d5233b]">Total: ₹{safeToFixed(oneTimeTotal)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="text-left px-2 py-2">Particulars</th>
                    <th className="text-center px-2 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {oneTimeData.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="font-medium whitespace-nowrap pr-2 py-2">{row.label}</td>
                      <td className="px-2 py-2 text-right">₹{safeToFixed(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Validation Results */}
          {validationResults && (
            <section>
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">Validation Results</h2>
                <div className="flex items-center gap-2">
                  <Badge variant={validationResults.passed ? "default" : "destructive"}>
                    {validationResults.passed ? "Passed" : "Failed"}
                  </Badge>
                  {validationResults.needs_doa && (
                    <Badge variant="secondary">Needs DOA Approval</Badge>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="text-left px-2 py-2">Metric</th>
                      <th className="text-center px-2 py-2">Value</th>
                      <th className="text-center px-2 py-2">Threshold</th>
                      <th className="text-center px-2 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(validationResults.results).map(([key, result]) => (
                      <tr key={key} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="font-medium whitespace-nowrap pr-2 py-2">
                          {(() => {
                            if (key === 'ebt_percent') return 'EBT Percent';
                            if (key === 'ebit_percent') return 'EBIT Percent';
                            return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                          })()}
                        </td>
                        <td className="px-2 py-2 text-right">
                          {key === 'capex' ? `₹${safeToFixed(result.value)} L` : 
                           key === 'credit_period' ? `${safeToFixed(result.value)} days` :
                           `${safeToFixed(result.value)}%`}
                        </td>
                        <td className="px-2 py-2 text-right">
                          {key === 'capex' ? `₹${safeToFixed(result.threshold)} L` : 
                           key === 'credit_period' ? `${safeToFixed(result.threshold)} days` :
                           `${safeToFixed(result.threshold)}%`}
                        </td>
                        <td className="px-2 py-2 text-center">
                          <Badge 
                            variant={result.passed ? "default" : result.needs_doa ? "secondary" : "destructive"}
                          >
                            {result.passed ? "Passed" : result.needs_doa ? "Needs DOA" : "Failed"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/obf/${id}/working`)}
            className="gap-2"
          >
            <ArrowLeft size={16} /> Back
          </Button>
          
          <Button 
            onClick={handleValidate}
            disabled={saving}
            className="gap-2 bg-[#d5233b] text-white hover:bg-[#d5233b]/90"
          >
            {saving ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                Validating...
              </>
            ) : (
              <>
                Validate OBF <ArrowRight size={16} />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </OBFWorkflow>
  );
} 