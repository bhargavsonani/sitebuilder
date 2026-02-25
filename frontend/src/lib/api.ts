// Same as axios: hit backend directly so auth and project use same origin
const API_BASE_URL = import.meta.env.VITE_BASEURL || "http://localhost:3000";

export interface DeleteAccountData {
  password: string;
}

export interface SignUpData {
  email: string;
  name: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: string;
      email: string;
      name: string;
      emailVerified: boolean;
      credits: number;
      totalCreation: number;
    };
    session?: {
      token: string;
      expiresAt: string;
    };
  };
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  credits: number;
  totalCreation: number;
}

export interface UpdateProfileData {
  name: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        if (!response.ok) {
          const error = new Error(`Request failed with status ${response.status}`);
          (error as any).status = response.status;
          throw error;
        }
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        // Include status code in error message for better debugging
        const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }

      return data;
    } catch (error: any) {
      // If it's already an Error with status, re-throw it
      if (error instanceof Error && (error as any).status) {
        throw error;
      }
      // Handle network errors (backend not running, CORS, etc.)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        const networkError = new Error("Network error: Failed to connect to server. Make sure the backend is running.");
        (networkError as any).status = 0;
        throw networkError;
      }
      // Re-throw if it's already an Error
      if (error instanceof Error) {
        throw error;
      }
      // Fallback for unknown errors
      throw new Error("Network error: Failed to connect to server");
    }
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signOut(): Promise<{ success: boolean; message: string }> {
    return this.request("/api/auth/signout", {
      method: "POST",
    });
  }

  async getCurrentUser(): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/me", {
      method: "GET",
    });
  }

  async updateProfile(data: UpdateProfileData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
  
  async deleteAccount(
    data: DeleteAccountData
  ): Promise<{ success: boolean; message: string }> {
    return this.request("/api/auth/delete-account", {
      method: "DELETE",
      body: JSON.stringify(data),
    });
  }
  

  async changePassword(
    data: ChangePasswordData
  ): Promise<{ success: boolean; message: string }> {
    return this.request("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}




export const apiClient = new ApiClient(API_BASE_URL);
