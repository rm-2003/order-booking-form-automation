"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { obfService, OBF as ApiOBF, userService } from "@/app/services/api";
import { User } from "@/app/types/auth";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, CheckCircle, Pencil, Trash, Warning, Database, MagnifyingGlass, Funnel, Plus, UserPlus, TrashSimple, File, FileText } from "@phosphor-icons/react";
import Image from 'next/image';

interface OBF extends ApiOBF {
  project_type: string;
  project_category: string;
  project_priority: string;
  project_status: string;
  creatorId: string;
}

// Enum options from the database
const PROJECT_TYPES = ["New", "Extension", "Renewal"];
const PROJECT_CATEGORIES = ["Implementation", "Support", "Maintenance"];
const PROJECT_PRIORITIES = ["High", "Medium", "Low"];
const PROJECT_STATUSES = ["draft", "submitted", "approved", "rejected", "archived"];

// Helper to get color classes for project_status
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

export default function OBFPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [obfs, setObfs] = useState<OBF[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Operation successful!");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userAccessLevels, setUserAccessLevels] = useState<Record<string, string>>({});
  const [newObf, setNewObf] = useState({
    project_code: "",
    project_name: "",
    opportunity_id: "",
    client_name: "",
    description: "",
    project_type: PROJECT_TYPES[0],
    project_category: PROJECT_CATEGORIES[0],
    project_priority: PROJECT_PRIORITIES[0],
    project_status: "draft",
    creatorId: "",
    working_data: {}
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedObfs, setSelectedObfs] = useState<string[]>([]);
  const [editObf, setEditObf] = useState<OBF | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");

  useEffect(() => {
    loadOBFs();
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await usersResponse.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadOBFs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const obfsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!obfsResponse.ok) {
        throw new Error('Failed to fetch OBFs');
      }
      const data = await obfsResponse.json();
      setObfs(data);
      setError(null);
    } catch (err) {
      setError("Failed to load OBFs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    // First fetch OBF details to ensure they're available when the edit page loads
    try {
      // Store the OBF ID in localStorage so the input page can use it
      localStorage.setItem('editingObfId', id);
      
      // Navigate to the input page for editing
      router.push(`/obf/${id}/input`);
    } catch (err) {
      setError("Failed to prepare OBF for editing");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obf/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete OBF');
      }

      setObfs(obfs.filter(obf => obf.id !== id));
      setDeleteId(null);
      setSuccessMessage("OBF deleted successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      setError("Failed to delete OBF");
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    try {
      await obfService.create({
        project_code: newObf.project_code,
        project_name: newObf.project_name,
        opportunity_id: newObf.opportunity_id,
        client_name: newObf.client_name,
        description: newObf.description || null,
        project_type: newObf.project_type,
        project_category: newObf.project_category,
        project_priority: newObf.project_priority,
        project_status: newObf.project_status,
        status: 'draft', // Added missing required status field
        creatorId: user?.id || "",
        working_data: {},
        userAccess: selectedUsers.map(userId => ({
          userId,
          role: 'Salesperson',
          accessLevel: userAccessLevels[userId] || 'view'
        })),
        created_at: new Date(),
        updated_at: new Date()
      });
      // After creation, fetch all OBFs again
      await loadOBFs();
      setShowCreate(false);
      setNewObf({
        project_code: "",
        project_name: "",
        opportunity_id: "",
        client_name: "",
        description: "",
        project_type: PROJECT_TYPES[0],
        project_category: PROJECT_CATEGORIES[0],
        project_priority: PROJECT_PRIORITIES[0],
        project_status: "draft",
        creatorId: user?.id || "",
        working_data: {}
      });
      setSelectedUsers([]);
      setUserAccessLevels({});
      setSuccessMessage("OBF created successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to create OBF");
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return '';
    }
  };

  // Bulk delete handler
  const handleBulkDelete = async (ids: string[]) => {
    for (const id of ids) {
      await handleDelete(id);
    }
    setSelectedObfs([]);
  };

  // When opening the modal, ensure the creator is present in the access list as admin
  const openCreateModal = () => {
    // Reset form state
    setNewObf({
      project_code: '',
      project_name: '',
      opportunity_id: '',
      client_name: '',
      description: '',
      project_type: PROJECT_TYPES[0],
      project_category: PROJECT_CATEGORIES[0],
      project_priority: PROJECT_PRIORITIES[0],
      project_status: 'draft',
      creatorId: user?.id || '',
      working_data: {}
    });
    if (user?.id) {
      setSelectedUsers([user.id]);
      setUserAccessLevels({ [user.id]: 'admin' });
    } else {
      setSelectedUsers([]);
      setUserAccessLevels({});
    }
    setShowCreate(true);
    loadUsers();
  };

  // Open edit dialog with selected OBF
  const openEditDialog = async (obf: OBF) => {
    console.log('Opening edit dialog for OBF:', obf);
    setEditObf(obf);
    setShowEditDialog(true);
    setNewObf({
      project_code: obf.project_code,
      project_name: obf.project_name,
      opportunity_id: obf.opportunity_id,
      client_name: obf.client_name,
      description: obf.description || "",
      project_type: obf.project_type,
      project_category: obf.project_category,
      project_priority: obf.project_priority,
      project_status: obf.project_status,
      creatorId: obf.creatorId || "",
      working_data: obf.working_data || {}
    });
    // Fetch user access list for this OBF
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching user access for OBF:', obf.id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obf-access/${obf.id}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const accessList = await res.json();
        console.log('Received access list:', accessList);
        setSelectedUsers(accessList.map((u: any) => u.userId));
        setUserAccessLevels(Object.fromEntries(accessList.map((u: any) => [u.userId, u.accessLevel])));
      } else {
        console.warn('Failed to fetch access list, status:', res.status);
        // If no access list is found, set the creator as admin
        setSelectedUsers([obf.creatorId]);
        setUserAccessLevels({ [obf.creatorId]: 'admin' });
      }
    } catch (err) {
      console.error('Error fetching user access:', err);
      // If there's an error, set the creator as admin
      setSelectedUsers([obf.creatorId]);
      setUserAccessLevels({ [obf.creatorId]: 'admin' });
    }
  };

  // Handle edit submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editObf) return;
    setCreateLoading(true);
    setCreateError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Starting OBF update for:', editObf.id);
      // First update the OBF
      await obfService.update(editObf.id, {
        ...newObf,
        working_data: newObf.working_data || {}
      });

      // Then update user access
      console.log('Fetching current access list');
      const currentAccess = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obf-access/${editObf.id}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json());
      console.log('Current access list:', currentAccess);

      // Remove users that are no longer in the list
      console.log('Removing users not in selectedUsers:', selectedUsers);
      for (const access of currentAccess) {
        if (!selectedUsers.includes(access.userId)) {
          console.log('Removing access for user:', access.userId);
          const deleteRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obf-access/${editObf.id}/users/${access.userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!deleteRes.ok) {
            console.error('Failed to remove user access:', await deleteRes.text());
          }
        }
      }

      // Add or update users
      console.log('Adding/updating users:', selectedUsers);
      for (const userId of selectedUsers) {
        const accessLevel = userAccessLevels[userId] || 'view';
        console.log('Setting access level for user:', userId, 'to:', accessLevel);
        const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obf-access/${editObf.id}/users/${userId}`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ accessLevel })
        });
        if (!updateRes.ok) {
          console.error('Failed to update user access:', await updateRes.text());
        }
      }

      await loadOBFs();
      setShowEditDialog(false);
      setEditObf(null);
      setNewObf({
        project_code: "",
        project_name: "",
        opportunity_id: "",
        client_name: "",
        description: "",
        project_type: PROJECT_TYPES[0],
        project_category: PROJECT_CATEGORIES[0],
        project_priority: PROJECT_PRIORITIES[0],
        project_status: "draft",
        creatorId: user?.id || "",
        working_data: {}
      });
      setSelectedUsers([]);
      setUserAccessLevels({});
      setSuccessMessage("OBF updated successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err: any) {
      console.error('Error in handleEditSubmit:', err);
      setCreateError(err.response?.data?.message || "Failed to update OBF");
    } finally {
      setCreateLoading(false);
    }
  };

  // Add debug logging to the user selection handler
  const handleUserSelection = (value: string) => {
    console.log('User selected:', value);
    if (value && !selectedUsers.includes(value)) {
      console.log('Adding user to selectedUsers');
      setSelectedUsers(prev => {
        const newUsers = [...prev, value];
        console.log('New selectedUsers:', newUsers);
        return newUsers;
      });
      setUserAccessLevels(prev => {
        const newLevels = {
          ...prev,
          [value]: 'view'
        };
        console.log('New userAccessLevels:', newLevels);
        return newLevels;
      });
    }
  };

  // Helper to check if current user is admin for an OBF
  const isUserAdmin = (obf: OBF) => {
    if (!obf) return false;
    if (user?.id === obf.creatorId) return true;
    if (!obf.userAccess) {
      console.warn('No userAccess for OBF', obf.id, 'Current user:', user?.id);
      return false;
    }
    const access = obf.userAccess.find(u => u.userId === user?.id);
    return access?.accessLevel === 'admin';
  };

  // For create/edit dialogs, check admin status based on current user and creatorId
  const isCurrentUserAdmin = () => {
    if (showEditDialog && editObf) {
      return user?.id === editObf.creatorId || isUserAdmin(editObf);
    }
    if (showCreate) {
      return true; // User is always admin when creating a new OBF
    }
    return false;
  };

  // Filter OBFs based on search query and filters
  const filteredObfs = obfs.filter((obf) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      obf.project_code.toLowerCase().includes(q) ||
      obf.project_name.toLowerCase().includes(q) ||
      obf.client_name.toLowerCase().includes(q) ||
      (obf.opportunity_id && obf.opportunity_id.toLowerCase().includes(q));
    const matchesStatus = filterStatus ? obf.project_status === filterStatus : true;
    const matchesType = filterType ? obf.project_type === filterType : true;
    const matchesPriority = filterPriority ? obf.project_priority === filterPriority : true;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Image src="/Loading/newpreeload.gif" unoptimized alt="Loading..." width={150} height={150} priority />
        <div className="mt-4 text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary drop-shadow-sm flex gap-2 items-center"><FileText size={32} weight="duotone" /> Order Booking Forms</h1>
        <Button
          onClick={openCreateModal}
          className="flex items-center gap-2 shadow-md font-semibold bg-[#d5233b] text-white"
        >
          <Plus size={18} weight="bold" /> Create New OBF
        </Button>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200 text-red-700">
          <CardContent className="py-4">
            <div className="flex items-center">
              <Warning size={20} weight="bold" className="mr-2" />
              {error}
            </div>
          </CardContent>
        </Card>
      )}
      
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle size={20} weight="bold" />
          {successMessage}
        </div>
      )}

      {/* Create OBF Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle size={18} weight="bold" className="text-primary" /> New OBF
            </DialogTitle>
            <DialogDescription>
              Create a new Order Booking Form with the required information.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="project_code">Project Code *</Label>
                <Input
                  id="project_code"
                  value={newObf.project_code}
                  onChange={e => setNewObf({ ...newObf, project_code: e.target.value })}
                  required
                  placeholder="Enter project code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name *</Label>
                <Input
                  id="project_name"
                  value={newObf.project_name}
                  onChange={e => setNewObf({ ...newObf, project_name: e.target.value })}
                  required
                  placeholder="Enter project name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opportunity_id">Opportunity ID *</Label>
                <Input
                  id="opportunity_id"
                  value={newObf.opportunity_id}
                  onChange={e => setNewObf({ ...newObf, opportunity_id: e.target.value })}
                  required
                  placeholder="Enter opportunity ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  value={newObf.client_name}
                  onChange={e => setNewObf({ ...newObf, client_name: e.target.value })}
                  required
                  placeholder="Enter client name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_type">Project Type *</Label>
                <Select 
                  value={newObf.project_type} 
                  onValueChange={(value) => setNewObf({ ...newObf, project_type: value })}
                >
                  <SelectTrigger id="project_type">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_category">Project Category *</Label>
                <Select 
                  value={newObf.project_category} 
                  onValueChange={(value) => setNewObf({ ...newObf, project_category: value })}
                >
                  <SelectTrigger id="project_category">
                    <SelectValue placeholder="Select project category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_priority">Project Priority *</Label>
                <Select 
                  value={newObf.project_priority} 
                  onValueChange={(value) => setNewObf({ ...newObf, project_priority: value })}
                >
                  <SelectTrigger id="project_priority">
                    <SelectValue placeholder="Select project priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_PRIORITIES.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_status">Project Status *</Label>
                <Select 
                  value={newObf.project_status} 
                  onValueChange={(value) => setNewObf({ ...newObf, project_status: value })}
                >
                  <SelectTrigger id="project_status">
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="creatorId">Creator *</Label>
                <Select 
                  value={newObf.creatorId} 
                  onValueChange={(value) => setNewObf({ ...newObf, creatorId: value })}
                >
                  <SelectTrigger id="creatorId">
                    <SelectValue placeholder="Select creator" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(userItem => (
                      <SelectItem key={userItem.id} value={userItem.id}>
                        {userItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="min-h-[100px]"
                  value={newObf.description}
                  onChange={e => setNewObf({ ...newObf, description: e.target.value })}
                  placeholder="Enter project description"
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">User Access</Label>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Access Level</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedUsers.map((userId) => {
                        const userItem = users.find(u => u.id === userId);
                        if (!userItem) return null;
                        const isCreator = userId === user?.id;
                        return (
                          <TableRow key={userId}>
                            <TableCell>
                              <Label>{userItem.name}{isCreator ? " (Creator)" : ""}</Label>
                            </TableCell>
                            <TableCell>
                              <Label>{userItem.role || "User"}</Label>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={userAccessLevels[userId] || 'view'}
                                onValueChange={(value) => {
                                  // Only allow setting 'admin' if current user is admin
                                  if (value === 'admin' && !isCurrentUserAdmin()) return;
                                  setUserAccessLevels({
                                    ...userAccessLevels,
                                    [userId]: value
                                  });
                                }}
                                disabled={isCreator}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Access level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="view">View</SelectItem>
                                  <SelectItem value="edit">Edit</SelectItem>
                                  <SelectItem value="admin" disabled={!isCurrentUserAdmin()}>Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-center">
                              {!isCreator && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedUsers(selectedUsers.filter(id => id !== userId));
                                    const newAccessLevels = { ...userAccessLevels };
                                    delete newAccessLevels[userId];
                                    setUserAccessLevels(newAccessLevels);
                                  }}
                                >
                                  <Trash size={16} />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {/* Dropdown for adding users */}
                  <div className="p-2">
                    {users.length > 0 && users.filter(userItem => !selectedUsers.includes(userItem.id)).length > 0 ? (
                      <Select
                        value=""
                        onValueChange={handleUserSelection}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add user..." />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter(userItem => !selectedUsers.includes(userItem.id))
                            .map(userItem => (
                              <SelectItem key={userItem.id} value={userItem.id}>
                                {userItem.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : users.length > 0 ? (
                      <></>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            
            {createError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {createError}
              </div>
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreate(false)}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createLoading}
                className="gap-2"
              >
                {createLoading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Creating...
                  </>
                ) : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit OBF Modal */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil size={18} weight="bold" className="text-primary" /> Edit OBF
            </DialogTitle>
            <DialogDescription>
              Edit the details of this Order Booking Form.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="project_code">Project Code *</Label>
                <Input
                  id="project_code"
                  value={newObf.project_code}
                  onChange={e => setNewObf({ ...newObf, project_code: e.target.value })}
                  required
                  placeholder="Enter project code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name *</Label>
                <Input
                  id="project_name"
                  value={newObf.project_name}
                  onChange={e => setNewObf({ ...newObf, project_name: e.target.value })}
                  required
                  placeholder="Enter project name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opportunity_id">Opportunity ID *</Label>
                <Input
                  id="opportunity_id"
                  value={newObf.opportunity_id}
                  onChange={e => setNewObf({ ...newObf, opportunity_id: e.target.value })}
                  required
                  placeholder="Enter opportunity ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  value={newObf.client_name}
                  onChange={e => setNewObf({ ...newObf, client_name: e.target.value })}
                  required
                  placeholder="Enter client name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_type">Project Type *</Label>
                <Select 
                  value={newObf.project_type} 
                  onValueChange={(value) => setNewObf({ ...newObf, project_type: value })}
                >
                  <SelectTrigger id="project_type">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_category">Project Category *</Label>
                <Select 
                  value={newObf.project_category} 
                  onValueChange={(value) => setNewObf({ ...newObf, project_category: value })}
                >
                  <SelectTrigger id="project_category">
                    <SelectValue placeholder="Select project category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_priority">Project Priority *</Label>
                <Select 
                  value={newObf.project_priority} 
                  onValueChange={(value) => setNewObf({ ...newObf, project_priority: value })}
                >
                  <SelectTrigger id="project_priority">
                    <SelectValue placeholder="Select project priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_PRIORITIES.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_status">Project Status *</Label>
                <Select 
                  value={newObf.project_status} 
                  onValueChange={(value) => setNewObf({ ...newObf, project_status: value })}
                >
                  <SelectTrigger id="project_status">
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="creatorId">Creator *</Label>
                <Select 
                  value={newObf.creatorId} 
                  onValueChange={(value) => setNewObf({ ...newObf, creatorId: value })}
                >
                  <SelectTrigger id="creatorId">
                    <SelectValue placeholder="Select creator" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(userItem => (
                      <SelectItem key={userItem.id} value={userItem.id}>
                        {userItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="min-h-[100px]"
                  value={newObf.description}
                  onChange={e => setNewObf({ ...newObf, description: e.target.value })}
                  placeholder="Enter project description"
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">User Access</Label>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Access Level</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-400">No users have access to this OBF.</TableCell>
                        </TableRow>
                      ) : (
                        selectedUsers.map((userId) => {
                          const userItem = users.find(u => u.id === userId);
                          if (!userItem) return null;
                          const isCreator = userId === user?.id;
                          return (
                            <TableRow key={userId}>
                              <TableCell>
                                <Label>{userItem.name}{isCreator ? " (Creator)" : ""}</Label>
                              </TableCell>
                              <TableCell>
                                <Label>{userItem.role || "User"}</Label>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={userAccessLevels[userId] || 'view'}
                                  onValueChange={(value) => {
                                    // Only allow setting 'admin' if current user is admin
                                    if (value === 'admin' && !isCurrentUserAdmin()) return;
                                    setUserAccessLevels({
                                      ...userAccessLevels,
                                      [userId]: value
                                    });
                                  }}
                                  disabled={isCreator}
                                >
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Access level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="view">View</SelectItem>
                                    <SelectItem value="edit">Edit</SelectItem>
                                    <SelectItem value="admin" disabled={!isCurrentUserAdmin()}>Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-center">
                                {!isCreator && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedUsers(selectedUsers.filter(id => id !== userId));
                                      const newAccessLevels = { ...userAccessLevels };
                                      delete newAccessLevels[userId];
                                      setUserAccessLevels(newAccessLevels);
                                    }}
                                  >
                                    <Trash size={16} />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                  {/* Dropdown for adding users */}
                  <div className="p-2">
                    {users.length > 0 && users.filter(userItem => !selectedUsers.includes(userItem.id)).length > 0 ? (
                      <Select
                        value=""
                        onValueChange={handleUserSelection}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add user..." />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter(userItem => !selectedUsers.includes(userItem.id))
                            .map(userItem => (
                              <SelectItem key={userItem.id} value={userItem.id}>
                                {userItem.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : users.length > 0 ? (
                      <></>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            
            {createError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {createError}
              </div>
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowEditDialog(false)}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createLoading}
                className="gap-2"
              >
                {createLoading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Updating...
                  </>
                ) : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <div className="flex justify-between items-center px-5 py-3">
            <div className="flex items-center gap-2 relative">
              <MagnifyingGlass className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <Input
                placeholder="Search OBF..."
                className="pl-8 py-6 shadow-none border border-gray-300 focus:border-[#d5233b] focus-visible:border-[#d5233b] rounded-md"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              {selectedObfs.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleBulkDelete(selectedObfs)}
                  className="text-red-500 hover:bg-red-500 hover:text-white rounded-full"
                >
                  <Trash weight="duotone" size={20} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setShowFilters((prev) => !prev)}
                aria-label="Toggle filters"
              >
                <Funnel size={20} />
              </Button>
            </div>
          </div>
          {showFilters && (
            <div className="px-5 pb-3">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-700">
                <div className="font-semibold mb-2">Filters</div>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Status</label>
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                    >
                      <option value="">All</option>
                      {PROJECT_STATUSES.filter(s => s !== 'archived').map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Type</label>
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={filterType}
                      onChange={e => setFilterType(e.target.value)}
                    >
                      <option value="">All</option>
                      {PROJECT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Priority</label>
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={filterPriority}
                      onChange={e => setFilterPriority(e.target.value)}
                    >
                      <option value="">All</option>
                      {PROJECT_PRIORITIES.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="ml-2 px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300"
                    onClick={e => {
                      e.preventDefault();
                      setFilterStatus("");
                      setFilterType("");
                      setFilterPriority("");
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f4f6f8]">
                <TableHead className='font-semibold'>
                  <Input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedObfs.length === obfs.length && obfs.length > 0}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedObfs(obfs.map(obf => String(obf.id)));
                      } else {
                        setSelectedObfs([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead className='font-semibold'>Project Code</TableHead>
                <TableHead className='font-semibold'>Project Name</TableHead>
                <TableHead className='font-semibold'>Client</TableHead>
                <TableHead className='font-semibold'>Status</TableHead>
                <TableHead className='font-semibold'>Created</TableHead>
                <TableHead className='font-semibold'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObfs.map((obf) => (
                <TableRow
                  key={obf.id || Math.random()}
                  onClick={() => router.push(`/obf/${obf.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <Input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectedObfs.includes(String(obf.id))}
                      onChange={e => {
                        const idStr = String(obf.id);
                        if (e.target.checked) {
                          setSelectedObfs(prev => [...prev, idStr]);
                        } else {
                          setSelectedObfs(prev => prev.filter(id => id !== idStr));
                        }
                      }}
                      onClick={e => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell>{obf.project_code}</TableCell>
                  <TableCell>{obf.project_name}</TableCell>
                  <TableCell>{obf.client_name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(obf.project_status)}`}>
                      {obf.project_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {typeof obf.created_at === 'string' 
                      ? new Date(obf.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }).replace(/\//g, '-')
                      : obf.created_at.toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }).replace(/\//g, '-')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 h-8">
                      {isUserAdmin(obf) && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={e => {
                              e.stopPropagation();
                              openEditDialog(obf);
                            }}
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={e => {
                              e.stopPropagation();
                              setDeleteId(obf.id);
                            }}
                          >
                            <Trash size={18} />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the OBF.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 