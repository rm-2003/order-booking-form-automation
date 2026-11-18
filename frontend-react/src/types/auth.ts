export interface User {
  id: string;
  email: string;
  name: string;
  provider: 'local' | 'google' | 'microsoft';
  providerId?: string;
  picture?: string;
  role?: string;
} 