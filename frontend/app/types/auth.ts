export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'local' | 'google' | 'microsoft';
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 