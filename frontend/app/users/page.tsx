'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MagnifyingGlass } from '@phosphor-icons/react';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider: 'local' | 'google' | 'microsoft';
  role?: string;
}

export default function UserPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && currentUser) {
      fetchUsers();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Users</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 relative">
              <MagnifyingGlass className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <Input
                placeholder="Search users..."
                className="pl-8 py-6 shadow-none border border-gray-300 focus:border-[#d5233b] focus-visible:border-[#d5233b] rounded-md"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='rounded-md'>
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <Image src="/Loading/newpreeload.gif" unoptimized alt="Loading..." width={150} height={150} priority />
              <div className="mt-4 text-lg text-gray-500">Loading...</div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <Table className='rounded-md'>
              <TableHeader>
                <TableRow className="bg-[#f4f6f8] font-semibold">
                  <TableHead className='font-semibold'>User</TableHead>
                  <TableHead className='font-semibold'>Email</TableHead>
                  <TableHead className='font-semibold'>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-muted-foreground">No users found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 