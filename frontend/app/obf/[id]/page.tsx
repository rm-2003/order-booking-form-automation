'use client';

import { useState, useEffect } from 'react';
import { obfService, OBF } from '../../services/api';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  CheckCircle, 
  Warning, 
  X, 
  Tag, 
  Buildings, 
  Clock, 
  TextT, 
  Calculator, 
  ChartPie, 
  CheckSquare,
  User,
  Calendar,
  FileText,
  ArrowRight
} from "@phosphor-icons/react";
import { obfWorkingService } from '../../services/api';
import { obfBreakupService } from '../../services/api';
import { use } from 'react';
import { toast } from "sonner";
import Image from 'next/image';

export default function OBFView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [obf, setObf] = useState<OBF | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stepProgress, setStepProgress] = useState<Record<string, 'pending' | 'in-progress' | 'completed'>>({
    input: 'pending',
    working: 'pending',
    costBreakup: 'pending',
    final: 'pending'
  });
  const [validationResults, setValidationResults] = useState<any>(null);

  useEffect(() => {
    loadObf();
  }, [resolvedParams.id]);

  const loadObf = async () => {
    try {
      setLoading(true);
      const response = await obfService.getById(resolvedParams.id);
      setObf(response.data);
      // Check completion status of each step
      const progress: Record<string, 'pending' | 'in-progress' | 'completed'> = {
        input: 'pending',
        working: 'pending',
        costBreakup: 'pending',
        final: 'pending'
      };
      
      // Check if input data exists
      try {
        const inputResponse = await obfService.getInputResults(resolvedParams.id);
        if (inputResponse.data) {
          progress.input = 'completed';
          // If input is completed, working should be in-progress
          progress.working = 'in-progress';
        }
      } catch (error) {
        progress.input = 'in-progress';
      }
      
      // Check if working data exists by checking all working-related endpoints
      try {
        const [revenueResponse, baRatesResponse, directExpensesResponse, financialMetricsResponse] = await Promise.all([
          obfWorkingService.getRevenue(resolvedParams.id),
          obfWorkingService.getBARates(resolvedParams.id),
          obfWorkingService.getDirectExpenses(resolvedParams.id),
          obfWorkingService.getFinancialMetrics(resolvedParams.id)
        ]);

        console.log('Working Data Responses:', {
          revenue: revenueResponse.data,
          baRates: baRatesResponse.data,
          directExpenses: directExpensesResponse.data,
          financialMetrics: financialMetricsResponse.data
        });

        // Check if any of the working data exists
        const hasWorkingData = [
          revenueResponse.data,
          baRatesResponse.data,
          directExpensesResponse.data,
          financialMetricsResponse.data
        ].some(data => data && Object.keys(data).length > 0);

        if (hasWorkingData) {
          console.log('Working data exists, setting to completed');
          progress.working = 'completed';
          // If working is completed, cost breakup should be in-progress
          progress.costBreakup = 'in-progress';
        } else {
          console.log('No working data found');
          // If input is completed but no working data, keep working as in-progress
          if (progress.input === 'completed') {
            progress.working = 'in-progress';
          }
        }
      } catch (error) {
        console.log('Error checking working data:', error);
        // If input is completed but working check fails, keep working as in-progress
        if (progress.input === 'completed') {
          progress.working = 'in-progress';
        }
      }
      
      // Check if cost breakup exists by checking all cost breakup related endpoints
      try {
        const [manpowerResponse, capexResponse, opexResponse, rentalResponse] = await Promise.all([
          obfBreakupService.getManpowerBreakup(resolvedParams.id),
          obfBreakupService.getCapexBreakup(resolvedParams.id),
          obfBreakupService.getOpexBreakup(resolvedParams.id),
          obfBreakupService.getRentBreakup(resolvedParams.id)
        ]);

        console.log('Cost Breakup Responses:', {
          manpower: manpowerResponse.data,
          capex: capexResponse.data,
          opex: opexResponse.data,
          rental: rentalResponse.data
        });

        // Check if any of the cost breakup data exists
        const hasCostBreakupData = [
          manpowerResponse.data,
          capexResponse.data,
          opexResponse.data,
          rentalResponse.data
        ].some(data => data && data.length > 0);

        if (hasCostBreakupData) {
          console.log('Cost breakup data exists, setting to completed');
          progress.costBreakup = 'completed';
          // If cost breakup is completed, final should be in-progress
          progress.final = 'in-progress';
        } else {
          console.log('No cost breakup data found');
          // If working is completed but no cost breakup data, keep cost breakup as in-progress
          if (progress.working === 'completed') {
            progress.costBreakup = 'in-progress';
          }
        }
      } catch (error) {
        console.log('Error checking cost breakup data:', error);
        // If working is completed but cost breakup check fails, keep cost breakup as in-progress
        if (progress.working === 'completed') {
          progress.costBreakup = 'in-progress';
        }
      }
      
      // Check if final output exists
      try {
        const finalResponse = await obfService.getFinalOutput(resolvedParams.id);
        if (finalResponse.data) {
          if (progress.costBreakup !== 'completed') {
            progress.final = 'pending';
          } else if (response.data.project_status === 'approved') {
            progress.final = 'completed';
          } else {
            progress.final = 'in-progress';
          }
        } else {
          // If cost breakup is completed but no final output, keep final as in-progress
          if (progress.costBreakup === 'completed') {
            progress.final = 'in-progress';
          }
        }
      } catch (error) {
        // If cost breakup is completed but final check fails, keep final as in-progress
        if (progress.costBreakup === 'completed') {
          progress.final = 'in-progress';
        }
      }
      
      console.log('Final Progress State:', progress);
      setStepProgress(progress);
      setError(null);
    } catch (error) {
      console.error('Error loading OBF:', error);
      setError('Failed to load OBF details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const steps = Object.values(stepProgress);
    const completedSteps = steps.filter(step => step === 'completed').length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Image src="/Loading/newpreeload.gif" unoptimized alt="Loading..." width={150} height={150} priority />
        <div className="mt-4 text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md shadow max-w-md">
          <p className="flex items-center">
            <X size={20} weight="bold" className="mr-2" />
            {error}
          </p>
        </div>
        <Button
          onClick={() => router.push('/obf')}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} weight="bold" />
          Back to OBF List
        </Button>
      </div>
    );
  }

  if (!obf) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-6 py-4 rounded-md shadow max-w-md">
          <p className="flex items-center">
            <Warning size={20} weight="bold" className="mr-2" />
            OBF not found
          </p>
        </div>
        <Button
          onClick={() => router.push('/obf')}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} weight="bold" />
          Back to OBF List
        </Button>
      </div>
    );
  }

  const workflowSteps = [
    {
      title: 'Input Results',
      description: 'Enter project details, duration, dates, and cost components',
      path: `/obf/${obf.id}/input`,
      status: stepProgress.input,
      icon: <TextT size={22} weight="bold" />,
      color: 'text-[#006c9c] bg-[#006c9c]/5'
    },
    {
      title: 'Working Values',
      description: 'Calculate escalation, credit period, and financial values',
      path: `/obf/${obf.id}/working`,
      status: stepProgress.working,
      icon: <Calculator size={22} weight="bold" />,
      color: 'text-[#d5233b] bg-[#d5233b]/5'
    },
    {
      title: 'Cost Breakup',
      description: 'Detailed breakdown of costs by category',
      path: `/obf/${obf.id}/cost-breakup`,
      status: stepProgress.costBreakup,
      icon: <ChartPie size={22} weight="bold" />,
      color: 'text-[#ff5630] bg-[#ff5630]/5'
    },
    {
      title: 'Final Output',
      description: 'Review and validate the complete OBF',
      path: `/obf/${obf.id}/final`,
      status: stepProgress.final,
      icon: <CheckSquare size={22} weight="bold" />,
      color: 'text-[#bfa100] bg-[#bfa100]/5'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-[#d5233b]/20 text-[#d5233b]';
      case 'rejected': return 'bg-[#ff5630]/20 text-[#ff5630]';
      case 'submitted': return 'bg-[#006c9c]/20 text-[#006c9c]';
      case 'draft': return 'bg-[#ffd666]/40 text-[#bfa100]';
      case 'archived': return 'bg-gray-200 text-gray-500';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">{obf.project_name}</h1>
                <div className="flex flex-wrap gap-4 text-foreground/80">
                  <span className="flex items-center gap-1.5">
                    <Tag size={16} weight="bold" className="text-[#006c9c]" />
                    {obf.project_code}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Buildings size={16} weight="bold" className="text-[#d5233b]" />
                    {obf.client_name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} weight="bold" className="text-[#ff5630]" />
                    {new Date(obf.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
                  <FileText size={14} weight="bold" className="text-[#006c9c]" />
                  {obf.project_type}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
                  <Calendar size={14} weight="bold" className="text-[#d5233b]" />
                  {obf.project_category}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
                  <User size={14} weight="bold" className="text-[#ff5630]" />
                  {obf.creatorId}
                </Badge>
                <Badge className={`${getStatusColor(obf.project_status)} px-3 py-1`}>
                  {obf.project_status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push('/obf')}
                variant="outline"
                className="flex items-center gap-1.5"
              >
                <ArrowLeft size={16} weight="bold" />
                Back
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const response = await obfService.validate(obf.id);
                    const validationData = response.data;
                    
                    if (validationData.passed) {
                      toast.success(validationData.message);
                    } else {
                      if (validationData.needs_doa) {
                        toast.warning("OBF requires DOA approval");
                      } else {
                        toast.error(validationData.message);
                      }
                    }
                    
                    // Update validation results state
                    setValidationResults(validationData);
                    
                    // Refresh the page data
                    await loadObf();
                  } catch (error) {
                    console.error('Error validating OBF:', error);
                    toast.error("Failed to validate OBF");
                  }
                }}
                className="flex items-center gap-1.5 bg-[#d5233b] hover:bg-[#d5233b]/90"
              >
                <CheckCircle size={16} weight="bold" />
                Validate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-black">Workflow Steps</h2>
          <Progress value={calculateProgress()} className="w-48" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step, index) => (
            <Card
              key={index}
              className="group hover:border-[#d5233b] hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => router.push(step.path)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${step.color}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-card-foreground transition-colors">
                        {step.title}
                      </h3>
                      <ArrowRight 
                        size={20} 
                        weight="bold" 
                        className="text-[#d5233b] opacity-0 group-hover:opacity-100 transition-opacity" 
                      />
                    </div>
                    <p className="text-sm text-card-foreground/70">{step.description}</p>
                    <Badge 
                      variant="outline" 
                      className={`${
                        step.status === 'completed' ? 'bg-[#d5233b]/20 text-[#d5233b] border-[#d5233b]/30' :
                        step.status === 'in-progress' ? 'bg-[#ffd666]/20 text-[#ffd666] border-[#ffd666]/30' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {step.status === 'pending' ? 'Pending' : step.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Approval Flow Progress */}
      {obf.validation_status && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-black">Approval Flow</h2>
            <Badge 
              variant="outline" 
              className={`${
                obf.validation_status === 'passed' ? 'bg-green-100 text-green-700 border-green-200' :
                obf.validation_status === 'needs_doa' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                'bg-red-100 text-red-700 border-red-200'
              }`}
            >
              {obf.validation_status === 'passed' ? 'Approved' : 
               obf.validation_status === 'needs_doa' ? 'Needs DOA' : 'Failed'}
            </Badge>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      obf.validation_status === 'passed' ? 'bg-green-500' :
                      obf.validation_status === 'needs_doa' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium">Validation</span>
                  </div>
                  <Badge variant="outline" className={
                    obf.validation_status === 'passed' ? 'bg-green-100 text-green-700 border-green-200' :
                    obf.validation_status === 'needs_doa' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-red-100 text-red-700 border-red-200'
                  }>
                    {obf.validation_status === 'passed' ? 'Passed' : 
                     obf.validation_status === 'needs_doa' ? 'Needs DOA' : 'Failed'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      obf.approval_status === 'approved' ? 'bg-green-500' :
                      obf.approval_status === 'pending' ? 'bg-amber-500' :
                      'bg-gray-300'
                    }`} />
                    <span className="text-sm font-medium">Approval</span>
                  </div>
                  <Badge variant="outline" className={
                    obf.approval_status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                    obf.approval_status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }>
                    {obf.approval_status === 'approved' ? 'Approved' : 
                     obf.approval_status === 'pending' ? 'Pending' : 'Not Started'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 