'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ROLES = [
  { value: 'Salesperson', label: 'Salesperson' },
  { value: 'BSH', label: 'BSH' },
  { value: 'Pricing', label: 'Pricing' },
  { value: 'BUSH', label: 'BUSH' },
  { value: 'Business Finance', label: 'Business Finance' },
  { value: 'BUH', label: 'BUH' },
  { value: 'CFO', label: 'CFO' },
  { value: 'MD & CEO', label: 'MD & CEO' },
];

export default function SelectRole() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setLoading(true);
    try {
      const token = searchParams.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-role`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      const data = await response.json();
      setUser(data.user);
      toast.success('Role updated successfully');
      router.push('/');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Select Your Role</CardTitle>
          <p className="text-center text-muted-foreground">
            Please select your role to continue
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading || !selectedRole}
            >
              {loading ? 'Updating...' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 