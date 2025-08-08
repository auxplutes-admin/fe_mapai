export interface LoginResponse {
    isLoggedIn: boolean;
    id: number;
    first_name: string;
    username: string;
    email: string;
    team_id: number;
    token: string;
    role_id: number;
    company_id: number;
    google_email: string;
    currentTime: number;
    expirationTime: number;
  }
  
  export interface LogoutResponse {
    isLoggedIn: boolean;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LogoutRequest {
    userId: string;
  }