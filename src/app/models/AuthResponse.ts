export interface AuthResponse{
  token: string;
  username: string;
  role: 'Admin' | 'User';
}