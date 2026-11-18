import { Request } from 'express';
import { SignOptions } from 'jsonwebtoken';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    url: string;
  };
  supabase: {
    url: string;
    key: string;
    serviceRoleKey: string;
  };
  jwt: {
    secret: string;
    expire: SignOptions['expiresIn'];
  };
  cors: {
    allowedOrigins: string[];
  };
  fileUpload: {
    maxSize: number;
    allowedExtensions: string[];
  };
  rateLimit: {
    perMinute: number;
  };
  logging: {
    level: string;
    file: string;
  };
}

export interface ProjectAttributes {
  id?: string;
  project_name: string;
  project_code: string;
  client_name: string;
  start_date?: Date;
  end_date?: Date;
  status?: 'active' | 'completed' | 'on-hold' | 'cancelled';
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CostBreakupAttributes {
  id?: string;
  obf_id: string;
  item_name: string;
  unit_cost: number;
  quantity: number;
  total_cost: number;
  category?: string;
  subcategory?: string;
  description?: string;
  currency?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface OBFAttributes {
  id: string;
  client_name: string;
  project_name: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  approval_date?: Date;
  approved_by?: string;
  remarks?: string;
  created_by?: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
  project_code: string;
  creatorId: string;
  cost_breakups?: CostBreakupAttributes[];
  validation_status?: string | null;
  validation_result?: any;
}

export interface RequestWithFile extends Request {
  file?: Express.Multer.File;
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
} 