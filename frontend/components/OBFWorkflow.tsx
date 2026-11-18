'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clipboard, Database, Calculator, ChartPie, CheckSquare } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface OBFWorkflowProps {
  id: string;
  currentStep?: 'input' | 'working' | 'cost-breakup' | 'final';
  children: React.ReactNode;
}

export function OBFWorkflow({ id, currentStep = 'input', children }: OBFWorkflowProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(currentStep);

  // Force update of active tab when currentStep prop changes
  useEffect(() => {
    setActiveTab(currentStep);
  }, [currentStep]);

  // Unified navigation helper
  const navigateTo = (path: string) => {
    router.push(`/obf/${id}/${path}`);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger 
            value="input" 
            className="flex items-center gap-2" 
            onClick={() => navigateTo('input')}
          >
            <Clipboard size={16} weight="duotone" />
            Input Data
          </TabsTrigger>
          <TabsTrigger 
            value="working" 
            className="flex items-center gap-2"
            onClick={() => navigateTo('working')}
          >
            <Calculator size={16} weight="duotone" />
            Working Sheet
          </TabsTrigger>
          <TabsTrigger 
            value="cost-breakup" 
            className="flex items-center gap-2"
            onClick={() => navigateTo('cost-breakup')}
          >
            <ChartPie size={16} weight="duotone" />
            Cost Breakup
          </TabsTrigger>
          <TabsTrigger 
            value="final" 
            className="flex items-center gap-2"
            onClick={() => navigateTo('final')}
          >
            <CheckSquare size={16} weight="duotone" />
            Final Output
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {children}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.push('/obf')}
        >
          Back to OBF List
        </Button>

        <div className="flex gap-2">
          {activeTab === 'input' && (
            <Button onClick={() => navigateTo('working')}>
              Continue to Working Sheet
            </Button>
          )}
          {activeTab === 'working' && (
            <>
              <Button variant="outline" onClick={() => navigateTo('input')}>
                Back to Input
              </Button>
              <Button onClick={() => navigateTo('cost-breakup')}>
                Continue to Cost Breakup
              </Button>
            </>
          )}
          {activeTab === 'cost-breakup' && (
            <>
              <Button variant="outline" onClick={() => navigateTo('working')}>
                Back to Working
              </Button>
              <Button onClick={() => navigateTo('final')}>
                Continue to Final Output
              </Button>
            </>
          )}
          {activeTab === 'final' && (
            <Button variant="outline" onClick={() => navigateTo('cost-breakup')}>
              Back to Cost Breakup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 