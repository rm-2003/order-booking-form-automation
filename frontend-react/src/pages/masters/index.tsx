"use client";

import { useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Users, Buildings, Factory, Money, Database, Upload, ChartLine } from "@phosphor-icons/react";
import { Skeleton } from "../../components/ui/skeleton";
import GlobalManpowerTable from "../../components/masters/GlobalManpowerTable";
import GlobalCapexTable from "../../components/masters/GlobalCapexTable";
import GlobalOpexTable from "../../components/masters/GlobalOpexTable";
import GlobalRentalTable from "../../components/masters/GlobalRentalTable";
import GlobalThresholdsTable from "../../components/masters/GlobalThresholdsTable";

export default function MastersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table');
  
  // Map table parameter to tab value
  const getDefaultTab = () => {
    switch (tableParam) {
      case 'capex':
        return 'capex';
      case 'opex':
        return 'opex';
      case 'rental':
        return 'rental';
      case 'thresholds':
        return 'thresholds';
      default:
        return 'manpower';
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'manpower') {
      params.delete('table');
    } else {
      params.set('table', value);
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // Add a loading state for demonstration (replace with actual loading logic if available)
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img src="/Loading/newpreeload.gif" alt="Loading..." width={150} height={150} />
        <div className="mt-4 text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Global Master Data
          </h1>
          <p className="text-gray-500">
            Manage standard reference data used across all OBFs
          </p>
        </div>
        {/* <div className="ml-auto">
          <ExcelUploader />
        </div> */}
      </div>

      <Tabs defaultValue={getDefaultTab()} className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="manpower" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Manpower
          </TabsTrigger>
          <TabsTrigger value="capex" className="flex items-center gap-2">
            <Factory className="h-4 w-4" />
            CAPEX
          </TabsTrigger>
          <TabsTrigger value="opex" className="flex items-center gap-2">
            <Money className="h-4 w-4" />
            OPEX
          </TabsTrigger>
          <TabsTrigger value="rental" className="flex items-center gap-2">
            <Buildings className="h-4 w-4" />
            Rental
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="flex items-center gap-2">
            <ChartLine className="h-4 w-4" />
            Thresholds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manpower">
          <Card>
            <CardHeader>
              <CardTitle>Manpower Data</CardTitle>
              <CardDescription>
                Manage global manpower master data used across all OBFs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GlobalManpowerTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capex">
          <Card>
            <CardHeader>
              <CardTitle>CAPEX Data</CardTitle>
              <CardDescription>
                Manage global CAPEX master data used across all OBFs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GlobalCapexTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opex">
          <Card>
            <CardHeader>
              <CardTitle>OPEX Data</CardTitle>
              <CardDescription>
                Manage global OPEX master data used across all OBFs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GlobalOpexTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rental">
          <Card>
            <CardHeader>
              <CardTitle>Rental Data</CardTitle>
              <CardDescription>
                Manage global rental master data used across all OBFs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GlobalRentalTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds">
          <Card>
            <CardHeader>
              <CardTitle>Thresholds Data</CardTitle>
              <CardDescription>
                Manage threshold entries for different verticals and project types.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GlobalThresholdsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 