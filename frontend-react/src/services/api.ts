import axios from 'axios';
import { User } from '../types/auth';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true
});

// Add request interceptor to include auth token and debug log
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Debug log for outgoing requests
  if (config.url && config.url.includes('/users')) {
    console.log('[API DEBUG] Request to:', config.url);
    console.log('[API DEBUG] Authorization header:', config.headers.Authorization);
    console.log('[API DEBUG] Full headers:', config.headers);
  }
  return config;
});

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Types matching backend models
export interface Project {
  id: string;
  project_code: string;
  project_name: string;
  opportunity_id: string;
  client_name: string;
  status: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface OBFAccess {
  userId: string;
  accessLevel: string;
  role: string;
}

export interface OBF {
  id: string;
  project_code: string;
  project_name: string;
  opportunity_id: string;
  client_name: string;
  description: string | null;
  project_type: string;
  project_category: string;
  project_priority: string;
  project_status: string;
  status: string;
  working_data: any;
  validation_status?: 'passed' | 'needs_doa' | 'failed';
  approval_status?: 'approved' | 'pending' | null;
  current_approver_role?: string;
  current_approver_user_id?: string;
  created_at: Date;
  updated_at: Date;
  creatorId: string;
  userAccess?: OBFAccess[];
}

// Models for breakup tables
export interface ManpowerBreakup {
  id?: string;
  obf_id: string;
  sr_no: number;
  role_description: string;
  mll_grade?: string;
  category?: string;
  roll?: string;
  ctc?: number;
  nos: number;
  created_at?: string;
  updated_at?: string;
}

export interface CapexBreakup {
  id?: string;
  obf_id: string;
  sr_no: number;
  asset: string;
  asset_description?: string;
  category?: string;
  period?: number;
  amc?: number;
  unit_cost?: number;
  nos: number;
  created_at?: string;
  updated_at?: string;
}

export interface OpexBreakup {
  id?: string;
  obf_id: string;
  sr_no: number;
  cost_description: string;
  unit_cost_per_month?: number;
  nos: number;
  created_at?: string;
  updated_at?: string;
}

export interface RentBreakup {
  id?: string;
  obf_id: string;
  built_up_to_carpet_ratio?: number;
  rent_per_sqft_on_built_up?: number;
  built_up_area_sqft?: number;
  building_maintenance?: number;
  warai_charges?: number;
  interest_on_security_deposit?: number;
  brokerage?: number;
  pre_go_live_rental?: number;
  master_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ImplementationCost {
  id?: string;
  obf_id: string;
  cost_type: string;
  unit_cost: number;
  nos: number;
  created_at?: string;
  updated_at?: string;
}

export interface PreGoLiveManpower {
  id?: string;
  obf_id: string;
  manpower_type: string;
  nos: number;
  cost_per_month: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdditionalImplementationCost {
  id?: string;
  obf_id: string;
  description: string;
  unit_cost: number;
  nos: number;
  created_at?: string;
  updated_at?: string;
}

// Types
export interface OBFInputResult {
  id?: string;
  project_id: string;
  project_name: string;
  opportunity_id: string;
  location: string;
  state: string;
  vertical: string;
  project_type: string;
  projection_period: number;
  customer_payment_terms: number;
  capex_amortisation: number;
  amc_first_year: number;
  depreciation: number;
  interest: number;
  asset_backing: number;
  redeploy_asset: number;
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
  created_at?: string;
  updated_at?: string;
}

// API Services
export const projectService = {
  getAll: () => api.get<Project[]>('/projects'),
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Project>('/projects', data),
  update: (id: string, data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => 
    api.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const obfService = {
  getAll: () => api.get<OBF[]>('/obf'),
  getById: (id: string) => api.get<OBF>(`/obf/${id}`),
  create: (data: Omit<OBF, 'id'>) => api.post<OBF>('/obf', data),
  update: (id: string, data: Partial<OBF>) => api.put<OBF>(`/obf/${id}`, data),
  delete: (id: string) => api.delete(`/obf/${id}`),
  validate: (id: string) => api.post(`/obf/${id}/validate`),
  saveInputResults: (id: string, inputResults: any) => api.post(`/obf/${id}/input`, inputResults),
  saveWorkingData: (id: string, workingData: any) => api.post(`/obf/${id}/working`, workingData),
  getInputResults: (id: string) => api.get(`/obf/${id}/input`),
  getWorkingValues: (id: string) => api.get(`/obf/${id}/working`),
  getCostBreakup: (id: string) => api.get(`/obf/${id}/cost-breakup`),
  getFinalOutput: (id: string) => api.get(`/obf/${id}/final-output`),
  getManpower: (id: string) => api.get(`/obf/${id}/manpower`),
  getCapex: (id: string) => api.get(`/obf/${id}/capex`),
  getOpex: (id: string) => api.get(`/obf/${id}/opex`),
  getRental: (id: string) => api.get(`/obf/${id}/rental`),
  getImplementationCost: (id: string) => api.get(`/obf/${id}/implementation-cost`),
  getPreGoLiveManpower: (id: string) => api.get(`/obf/${id}/pre-go-live-manpower`),
  getAdditionalImplementationCost: (id: string) => api.get(`/obf/${id}/additional-implementation-cost`),
  saveManpower: (id: string, data: any) => api.post(`/obf/${id}/manpower`, data),
  saveCapex: (id: string, data: any) => api.post(`/obf/${id}/capex`, data),
  saveOpex: (id: string, data: any) => api.post(`/obf/${id}/opex`, data),
  saveRental: (id: string, data: any) => api.post(`/obf/${id}/rental`, data),
  saveImplementationCost: (id: string, data: any) => api.post(`/obf/${id}/implementation-cost`, data),
  savePreGoLiveManpower: (id: string, data: any) => api.post(`/obf/${id}/pre-go-live-manpower`, data),
  saveAdditionalImplementationCost: (id: string, data: any) => api.post(`/obf/${id}/additional-implementation-cost`, data),
};

export const obfInputService = {
  getByObfId: (obfId: string) => api.get(`/obf/${obfId}/input`),
  update: (obfId: string, data: any) => api.put(`/obf/${obfId}/input`, data),
};

export const obfWorkingService = {
  getRevenue: (obfId: string) => {
    console.log('Fetching revenue for OBF:', obfId);
    return api.get(`/obf/${obfId}/revenue`);
  },
  saveRevenue: (obfId: string, data: any) => {
    console.log('Saving revenue for OBF:', obfId, data);
    return api.post(`/obf/${obfId}/revenue`, data);
  },
  getBARates: (obfId: string) => {
    console.log('Fetching BA rates for OBF:', obfId);
    return api.get(`/obf/${obfId}/ba-rates`);
  },
  saveBARates: (obfId: string, data: any) => {
    console.log('Saving BA rates for OBF:', obfId, data);
    return api.post(`/obf/${obfId}/ba-rates`, data);
  },
  getDirectExpenses: (obfId: string) => {
    console.log('Fetching direct expenses for OBF:', obfId);
    return api.get(`/obf/${obfId}/direct-expenses`);
  },
  saveDirectExpenses: (obfId: string, data: any) => {
    console.log('Saving direct expenses for OBF:', obfId, data);
    return api.post(`/obf/${obfId}/direct-expenses`, data);
  },
  getFinancialMetrics: (obfId: string) => {
    console.log('Fetching financial metrics for OBF:', obfId);
    return api.get(`/obf/${obfId}/financial-metrics`);
  },
  saveFinancialMetrics: (obfId: string, data: any) => {
    console.log('Saving financial metrics for OBF:', obfId, data);
    return api.post(`/obf/${obfId}/financial-metrics`, data);
  },
  getInputResult: (obfId: string) => {
    console.log('Fetching input result for OBF:', obfId);
    return api.get(`/obf/${obfId}/input-result`);
  },
};

// API Services for breakup tables
export const obfBreakupService = {
  // Manpower breakup
  getManpowerBreakup: (obfId: string) => 
    api.get<ManpowerBreakup[]>(`/cost-breakup/${obfId}/manpower`),
  createManpowerBreakup: (data: ManpowerBreakup[]) => 
    api.post<ManpowerBreakup[]>(`/cost-breakup/${data[0].obf_id}/manpower`, data),
  updateManpowerBreakup: (id: string, data: ManpowerBreakup) => 
    api.put<ManpowerBreakup>(`/cost-breakup/${data.obf_id}/manpower/${id}`, data),
  deleteManpowerBreakup: (id: string, obfId: string) => 
    api.delete(`/cost-breakup/${obfId}/manpower/${id}`),
    
  // Capex breakup
  getCapexBreakup: (obfId: string) => 
    api.get<CapexBreakup[]>(`/cost-breakup/${obfId}/capex`),
  createCapexBreakup: (data: CapexBreakup[]) => 
    api.post<CapexBreakup[]>(`/cost-breakup/${data[0].obf_id}/capex`, data),
  updateCapexBreakup: (id: string, data: CapexBreakup) => 
    api.put<CapexBreakup>(`/cost-breakup/${data.obf_id}/capex/${id}`, data),
  deleteCapexBreakup: (id: string, obfId: string) => 
    api.delete(`/cost-breakup/${obfId}/capex/${id}`),
    
  // Opex breakup
  getOpexBreakup: (obfId: string) => 
    api.get<OpexBreakup[]>(`/cost-breakup/${obfId}/opex`),
  createOpexBreakup: (data: OpexBreakup[]) => 
    api.post<OpexBreakup[]>(`/cost-breakup/${data[0].obf_id}/opex`, data),
  updateOpexBreakup: (id: string, data: OpexBreakup) => 
    api.put<OpexBreakup>(`/cost-breakup/${data.obf_id}/opex/${id}`, data),
  deleteOpexBreakup: (id: string, obfId: string) => 
    api.delete(`/cost-breakup/${obfId}/opex/${id}`),
    
  // Rent breakup
  getRentBreakup: (obfId: string) => 
    api.get<RentBreakup[]>(`/cost-breakup/${obfId}/rental`),
  createRentalBreakup: (data: RentBreakup[]) => 
    api.post<RentBreakup[]>(`/cost-breakup/${data[0].obf_id}/rental`, data),
  updateRentalBreakup: (id: string, data: RentBreakup) => 
    api.put<RentBreakup>(`/cost-breakup/${data.obf_id}/rental/${id}`, data),
  deleteRentalBreakup: (id: string, obfId: string) => 
    api.delete(`/cost-breakup/${obfId}/rental/${id}`),
    
  // Implementation cost
  getImplementationCost: (obfId: string) => 
    api.get<ImplementationCost[]>(`/cost-breakup/${obfId}/implementation-cost`),
  createImplementationCost: (data: ImplementationCost[]) => 
    api.post<ImplementationCost[]>(`/cost-breakup/${data[0].obf_id}/implementation-cost`, data),
  updateImplementationCost: (id: string, data: ImplementationCost) => 
    api.put<ImplementationCost>(`/cost-breakup/${data.obf_id}/implementation-cost/${id}`, data),
  deleteImplementationCost: (id: string, obfId: string) => 
    api.delete(`/cost-breakup/${obfId}/implementation-cost/${id}`),
    
  // Pre go-live manpower
  getPreGoLiveManpower: (obfId: string) => 
    api.get<PreGoLiveManpower[]>(`/cost-breakup/${obfId}/pre-go-live-manpower`),
  createPreGoLiveManpower: (data: PreGoLiveManpower[]) => 
    api.post<PreGoLiveManpower[]>(`/cost-breakup/${data[0].obf_id}/pre-go-live-manpower`, data),
  updatePreGoLiveManpower: (id: string, data: PreGoLiveManpower) => 
    api.put<PreGoLiveManpower>(`/cost-breakup/${data.obf_id}/pre-go-live-manpower/${id}`, data),
  deletePreGoLiveManpower: (id: string, obfId: string) => 
    api.delete(`/cost-breakup/${obfId}/pre-go-live-manpower/${id}`),
    
  // Additional implementation cost
  getAdditionalImplementationCost: (obfId: string) => 
    api.get<AdditionalImplementationCost[]>(`/cost-breakup/${obfId}/additional-implementation-cost`),
  createAdditionalImplementationCost: (data: AdditionalImplementationCost[]) => 
    api.post<AdditionalImplementationCost[]>(`/cost-breakup/${data[0].obf_id}/additional-implementation-cost`, data),
  updateAdditionalImplementationCost: (id: string, data: AdditionalImplementationCost) => 
    api.put<AdditionalImplementationCost>(`/cost-breakup/${data.obf_id}/additional-implementation-cost/${id}`, data),
  deleteAdditionalImplementationCost: (id: string, obfId: string) => 
    api.delete(`/cost-breakup/${obfId}/additional-implementation-cost/${id}`),

  // Helper endpoints to access master records
  getManpowerMaster: (masterId: string) => 
    api.get(`/cost-breakup/manpower/master/${masterId}`),
  getCapexMaster: (masterId: string) => 
    api.get(`/cost-breakup/capex/master/${masterId}`),
  getOpexMaster: (masterId: string) => 
    api.get(`/cost-breakup/opex/master/${masterId}`),
  getRentalMaster: (masterId: string) => 
    api.get(`/cost-breakup/rent/master/${masterId}`)
};

// OBF Input Result API
export const getOBFInputResult = async (obfId: string): Promise<OBFInputResult> => {
  const response = await fetch(`${API_BASE_URL}/obf-tables/${obfId}/input-result`);
  if (!response.ok) {
    throw new Error('Failed to fetch OBF input result');
  }
  return response.json();
};

export const saveOBFInputResult = async (obfId: string, data: OBFInputResult): Promise<OBFInputResult> => {
  const response = await fetch(`${API_BASE_URL}/obf-tables/${obfId}/input-result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to save OBF input result');
  }
  return response.json();
};

export const userService = {
  getAll: () => api.get<User[]>('/auth/users'),
  getById: (id: string) => api.get<User>(`/auth/users/${id}`),
  getMe: () => api.get('/auth/me'),
  create: (data: Omit<User, 'id'>) => api.post<User>('/auth/users', data),
  update: (id: string, data: Partial<User>) => {
    if (data.role !== undefined) {
      return api.post('/auth/update-role', { role: data.role });
    }
    return api.put<User>(`/auth/users/${id}`, data);
  },
  delete: (id: string) => api.delete(`/auth/users/${id}`),
};

export const rentalService = {
  getAll: () => api.get('/rental'),
  getById: (id: string) => api.get(`/rental/${id}`),
  getByObf: (obfId: string) => api.get(`/rental/obf/${obfId}`),
  create: (data: any) => api.post('/rental', data),
  update: (id: string, data: any) => api.put(`/rental/${id}`, data),
  delete: (id: string) => api.delete(`/rental/${id}`)
};

// Notification API
export const notificationService = {
  getAll: (unread?: boolean) =>
    api.get(`/obf/notifications${unread !== undefined ? `?unread=${unread}` : ''}`),
  markRead: (id: string) =>
    api.post(`/obf/notifications/${id}/read`),
};

// Approval Flow API
export const approvalService = {
  start: (obfId: string) => api.post(`/obf/${obfId}/start-approval`),
  approve: (obfId: string) => api.post(`/obf/${obfId}/approve`),
  reject: (obfId: string) => api.post(`/obf/${obfId}/reject`),
  getStatus: (obfId: string) => api.get(`/obf/${obfId}/approval-status`),
};