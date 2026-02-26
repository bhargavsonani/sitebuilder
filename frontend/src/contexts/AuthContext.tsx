// // // // import React, { createContext, useContext, useEffect, useState } from "react";
// // // // import { apiClient } from "@/lib/api";
// // // // import type { User } from "@/lib/api";
// // // // import { toast } from "sonner";

// // // // interface AuthContextType {
// // // //   user: User | null;
// // // //   loading: boolean;
// // // //   signIn: (email: string, password: string) => Promise<void>;
// // // //   signUp: (email: string, name: string, password: string) => Promise<void>;
// // // //   signOut: () => Promise<void>;
// // // //   refreshUser: () => Promise<void>;
// // // //   updateProfile: (name: string) => Promise<void>;
// // // //   changePassword: (
// // // //     currentPassword: string,
// // // //     newPassword: string
// // // //   ) => Promise<void>;
// // // //   deleteAccount: (password: string) => Promise<void>;
// // // // }

// // // // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // // // export const useAuth = () => {
// // // //   const context = useContext(AuthContext);
// // // //   if (!context) {
// // // //     throw new Error("useAuth must be used within an AuthProvider");
// // // //   }
// // // //   return context;
// // // // };

// // // // export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
// // // //   children,
// // // // }) => {
// // // //   const [user, setUser] = useState<User | null>(null);
// // // //   const [loading, setLoading] = useState(true);

// // // //   const refreshUser = async () => {
// // // //     try {
// // // //       const response = await apiClient.getCurrentUser();
// // // //       if (response.success && response.data?.user) {
// // // //         setUser(response.data.user);
// // // //         return true;
// // // //       } else {
// // // //         setUser(null);
// // // //         return false;
// // // //       }
// // // //     } catch (error: any) {
// // // //       // Silently fail if user is not authenticated (401/403) - this is expected
// // // //       // Also silently fail for network errors (backend not running)
// // // //       const status = (error as any)?.status ?? (error as any)?.response?.status;
// // // //       if (status !== 401 && status !== 403 && status !== 0) {
// // // //         console.error("Error refreshing user:", error);
// // // //       }
// // // //       setUser(null);
// // // //       return false;
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     refreshUser().finally(() => setLoading(false));
// // // //   }, []);

// // // //   const signIn = async (email: string, password: string) => {
// // // //     try {
// // // //       const response = await apiClient.signIn({ email, password });
// // // //       if (response.success && response.data?.user) {
// // // //         setUser(response.data.user);
// // // //         toast.success("Signed in successfully!");
// // // //       } else {
// // // //         throw new Error(response.message || "Sign in failed");
// // // //       }
// // // //     } catch (error: any) {
// // // //       toast.error(error.message || "Failed to sign in");
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   const signUp = async (email: string, name: string, password: string) => {
// // // //     try {
// // // //       const response = await apiClient.signUp({ email, name, password });
// // // //       if (response.success && response.data?.user) {
// // // //         setUser(response.data.user);
// // // //         toast.success("Account created successfully!");
// // // //       } else {
// // // //         throw new Error(response.message || "Sign up failed");
// // // //       }
// // // //     } catch (error: any) {
// // // //       toast.error(error.message || "Failed to create account");
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   const updateProfile = async (name: string) => {
// // // //     try {
// // // //       const response = await apiClient.updateProfile({ name });
// // // //       if (response.success && response.data?.user) {
// // // //         setUser(response.data.user);
// // // //         toast.success("Profile updated successfully!");
// // // //       } else {
// // // //         throw new Error(response.message || "Failed to update profile");
// // // //       }
// // // //     } catch (error: any) {
// // // //       toast.error(error.message || "Failed to update profile");
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   const changePassword = async (
// // // //     currentPassword: string,
// // // //     newPassword: string
// // // //   ) => {
// // // //     try {
// // // //       await apiClient.changePassword({ currentPassword, newPassword });
// // // //       toast.success(
// // // //         "Password changed successfully. Please sign in again for security."
// // // //       );
// // // //       await signOut();
// // // //     } catch (error: any) {
// // // //       toast.error(error.message || "Failed to change password");
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   const deleteAccount = async (password: string) => {
// // // //     try {
// // // //       const response = await apiClient.deleteAccount({ password });
  
// // // //       if (response.success) {
// // // //         // Clear user state immediately
// // // //         setUser(null);
// // // //         toast.success("Your account has been permanently deleted");
// // // //         // Return success - navigation will be handled by the component
// // // //         return;
// // // //       } else {
// // // //         throw new Error(response.message || "Failed to delete account");
// // // //       }
// // // //     } catch (error: any) {
// // // //       // Check if it's an authentication error
// // // //       const status = (error as any)?.status;
// // // //       if (status === 401 || status === 403) {
// // // //         // If unauthorized, try to refresh and retry once
// // // //         const refreshed = await refreshUser();
// // // //         if (refreshed) {
// // // //           // Retry the delete
// // // //           try {
// // // //             const retryResponse = await apiClient.deleteAccount({ password });
// // // //             if (retryResponse.success) {
// // // //               setUser(null);
// // // //               toast.success("Your account has been permanently deleted");
// // // //               return;
// // // //             }
// // // //           } catch (retryError: any) {
// // // //             toast.error(retryError.message || "Failed to delete account");
// // // //             throw retryError;
// // // //           }
// // // //         } else {
// // // //           toast.error("Session expired. Please sign in again.");
// // // //           throw new Error("Session expired");
// // // //         }
// // // //       } else {
// // // //         toast.error(error.message || "Failed to delete account");
// // // //         throw error;
// // // //       }
// // // //     }
// // // //   };
  

// // // //   const signOut = async () => {
// // // //     try {
// // // //       await apiClient.signOut();
// // // //       setUser(null);
// // // //       toast.success("Signed out successfully");
// // // //     } catch (error: any) {
// // // //       toast.error(error.message || "Failed to sign out");
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   return (
// // // //     <AuthContext.Provider
// // // //       value={{
// // // //         user,
// // // //         loading,
// // // //         signIn,
// // // //         signUp,
// // // //         signOut,
// // // //         refreshUser,
// // // //         updateProfile,
// // // //         changePassword,
// // // //         deleteAccount,
// // // //       }}
// // // //     >
// // // //       {children}
// // // //     </AuthContext.Provider>
// // // //   );
// // // // };


// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { apiClient } from "@/lib/api";
// import type { User } from "@/lib/api";
// import { toast } from "sonner";

// /* ===============================
//    Types
// ================================ */

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (email: string, name: string, password: string) => Promise<void>;
//   signOut: () => Promise<void>;
//   refreshUser: () => Promise<boolean>;
//   updateProfile: (name: string) => Promise<void>;
//   changePassword: (
//     currentPassword: string,
//     newPassword: string
//   ) => Promise<void>;
//   deleteAccount: (password: string) => Promise<void>;
// }

// /* ===============================
//    Context
// ================================ */

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return ctx;
// };

// /* ===============================
//    Provider
// ================================ */

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   /* ===============================
//      Refresh user (session check)
//   ================================ */
//   const refreshUser = async (): Promise<boolean> => {
//     try {
//       const response = await apiClient.getCurrentUser();

//       if (response.success && response.data?.user) {
//         setUser(response.data.user);
//         return true;
//       }

//       setUser(null);
//       return false;
//     } catch (error: any) {
//       const status =
//         (error as any)?.status ?? (error as any)?.response?.status;

//       // 401/403/0 are expected (not logged in / CORS / server down)
//       if (![0, 401, 403].includes(status)) {
//         console.error("refreshUser error:", error);
//       }

//       setUser(null);
//       return false;
//     }
//   };

//   useEffect(() => {
//     refreshUser().finally(() => setLoading(false));
//   }, []);

//   /* ===============================
//      Sign In
//   ================================ */
//   const signIn = async (email: string, password: string) => {
//     try {
//       const response = await apiClient.signIn({ email, password });

//       if (response.success && response.data?.user) {
//         setUser(response.data.user);
//         toast.success("Signed in successfully");
//         return;
//       }

//       throw new Error(response.message || "Sign in failed");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to sign in");
//       throw error;
//     }
//   };

//   /* ===============================
//      Sign Up
//   ================================ */
//   const signUp = async (
//     email: string,
//     name: string,
//     password: string
//   ) => {
//     try {
//       const response = await apiClient.signUp({ email, name, password });

//       if (response.success && response.data?.user) {
//         setUser(response.data.user);
//         toast.success("Account created successfully");
//         return;
//       }

//       throw new Error(response.message || "Sign up failed");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to create account");
//       throw error;
//     }
//   };

//   /* ===============================
//      Update profile
//   ================================ */
//   const updateProfile = async (name: string) => {
//     try {
//       const response = await apiClient.updateProfile({ name });

//       if (response.success && response.data?.user) {
//         setUser(response.data.user);
//         toast.success("Profile updated successfully");
//         return;
//       }

//       throw new Error(response.message || "Failed to update profile");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to update profile");
//       throw error;
//     }
//   };

//   /* ===============================
//      Change password
//   ================================ */
//   const changePassword = async (
//     currentPassword: string,
//     newPassword: string
//   ) => {
//     try {
//       await apiClient.changePassword({ currentPassword, newPassword });
//       toast.success(
//         "Password changed successfully. Please sign in again."
//       );
//       await signOut();
//     } catch (error: any) {
//       toast.error(error.message || "Failed to change password");
//       throw error;
//     }
//   };

//   /* ===============================
//      Delete account
//   ================================ */
//   const deleteAccount = async (password: string) => {
//     try {
//       const response = await apiClient.deleteAccount({ password });

//       if (response.success) {
//         setUser(null);
//         toast.success("Your account has been permanently deleted");
//         return;
//       }

//       throw new Error(response.message || "Failed to delete account");
//     } catch (error: any) {
//       const status = (error as any)?.status;

//       if (status === 401 || status === 403) {
//         toast.error("Session expired. Please sign in again.");
//       } else {
//         toast.error(error.message || "Failed to delete account");
//       }

//       throw error;
//     }
//   };

//   /* ===============================
//      Sign Out
//   ================================ */
//   const signOut = async () => {
//     try {
//       await apiClient.signOut();
//       setUser(null);
//       toast.success("Signed out successfully");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to sign out");
//       throw error;
//     }
//   };

//   /* ===============================
//      Provider
//   ================================ */
//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         signIn,
//         signUp,
//         signOut,
//         refreshUser,
//         updateProfile,
//         changePassword,
//         deleteAccount,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


// // import React, {
// //   createContext,
// //   useContext,
// //   useEffect,
// //   useState,
// // } from "react";
// // import api from "@/configs/axios";
// // import { toast } from "sonner";

// // /* ===============================
// //    Types
// // ================================ */

// // export interface User {
// //   id: string;
// //   email: string;
// //   name: string;
// //   emailVerified: boolean;
// //   credits: number;
// //   totalCreation: number;
// // }

// // interface AuthContextType {
// //   user: User | null;
// //   loading: boolean;
// //   signIn: (email: string, password: string) => Promise<void>;
// //   signUp: (email: string, name: string, password: string) => Promise<void>;
// //   signOut: () => Promise<void>;
// //   refreshUser: () => Promise<boolean>;
// //   updateProfile: (name: string) => Promise<void>;
// //   changePassword: (
// //     currentPassword: string,
// //     newPassword: string
// //   ) => Promise<void>;
// //   deleteAccount: (password: string) => Promise<void>;
// // }

// // /* ===============================
// //    Context
// // ================================ */

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export const useAuth = () => {
// //   const ctx = useContext(AuthContext);
// //   if (!ctx) {
// //     throw new Error("useAuth must be used within AuthProvider");
// //   }
// //   return ctx;
// // };

// // /* ===============================
// //    Provider
// // ================================ */

// // export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
// //   children,
// // }) => {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   /* ===============================
// //      Refresh user
// //   ================================ */
// //   const refreshUser = async (): Promise<boolean> => {
// //     try {
// //       const res = await api.get("/api/auth/me");

// //       if (res.data?.success && res.data?.data?.user) {
// //         setUser(res.data.data.user);
// //         return true;
// //       }

// //       setUser(null);
// //       return false;
// //     } catch (error: any) {
// //       const status = error?.response?.status;
// //       if (![401, 403].includes(status)) {
// //         console.error("refreshUser error:", error);
// //       }
// //       setUser(null);
// //       return false;
// //     }
// //   };

// //   useEffect(() => {
// //     refreshUser().finally(() => setLoading(false));
// //   }, []);

// //   /* ===============================
// //      Sign In
// //   ================================ */
// //   const signIn = async (email: string, password: string) => {
// //     try {
// //       const res = await api.post("/api/auth/signin", {
// //         email,
// //         password,
// //       });

// //       if (res.data?.success && res.data?.data?.user) {
// //         setUser(res.data.data.user);
// //         toast.success("Signed in successfully");
// //         return;
// //       }

// //       throw new Error(res.data?.message || "Sign in failed");
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || "Failed to sign in");
// //       throw error;
// //     }
// //   };

// //   /* ===============================
// //      Sign Up
// //   ================================ */
// //   const signUp = async (
// //     email: string,
// //     name: string,
// //     password: string
// //   ) => {
// //     try {
// //       const res = await api.post("/api/auth/signup", {
// //         email,
// //         name,
// //         password,
// //       });

// //       if (res.data?.success && res.data?.data?.user) {
// //         setUser(res.data.data.user);
// //         toast.success("Account created successfully");
// //         return;
// //       }

// //       throw new Error(res.data?.message || "Sign up failed");
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || "Failed to create account");
// //       throw error;
// //     }
// //   };

// //   /* ===============================
// //      Update profile
// //   ================================ */
// //   const updateProfile = async (name: string) => {
// //     try {
// //       const res = await api.put("/api/auth/me", { name });

// //       if (res.data?.success && res.data?.data?.user) {
// //         setUser(res.data.data.user);
// //         toast.success("Profile updated successfully");
// //         return;
// //       }

// //       throw new Error(res.data?.message || "Update failed");
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || "Failed to update profile");
// //       throw error;
// //     }
// //   };

// //   /* ===============================
// //      Change password
// //   ================================ */
// //   const changePassword = async (
// //     currentPassword: string,
// //     newPassword: string
// //   ) => {
// //     try {
// //       await api.post("/api/auth/change-password", {
// //         currentPassword,
// //         newPassword,
// //       });

// //       toast.success("Password changed. Please sign in again.");
// //       await signOut();
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || "Password change failed");
// //       throw error;
// //     }
// //   };

// //   /* ===============================
// //      Delete account
// //   ================================ */
// //   const deleteAccount = async (password: string) => {
// //     try {
// //       const res = await api.delete("/api/auth/delete-account", {
// //         data: { password },
// //       });

// //       if (res.data?.success) {
// //         setUser(null);
// //         toast.success("Account deleted permanently");
// //         return;
// //       }

// //       throw new Error(res.data?.message || "Delete failed");
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || "Failed to delete account");
// //       throw error;
// //     }
// //   };

// //   /* ===============================
// //      Sign Out
// //   ================================ */
// //   const signOut = async () => {
// //     try {
// //       await api.post("/api/auth/signout");
// //       setUser(null);
// //       toast.success("Signed out successfully");
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || "Sign out failed");
// //       throw error;
// //     }
// //   };

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         loading,
// //         signIn,
// //         signUp,
// //         signOut,
// //         refreshUser,
// //         updateProfile,
// //         changePassword,
// //         deleteAccount,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };




import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/configs/axios";
import { toast } from "sonner";

/* ===============================
   Types
================================ */

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  credits: number;
  totalCreation: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, name: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
  updateProfile: (name: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

/* ===============================
   Context
================================ */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

/* ===============================
   Provider
================================ */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     Refresh user
  ================================ */
  const refreshUser = async (): Promise<boolean> => {
    try {
      const res = await api.get("/api/auth/me");

      if (res.data?.success && res.data?.data?.user) {
        setUser(res.data.data.user);
        return true;
      }

      setUser(null);
      return false;
    } catch (error: any) {
      const status = error?.response?.status;
      if (![401, 403].includes(status)) {
        console.error("refreshUser error:", error);
      }
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  /* ===============================
     Sign In
  ================================ */
  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post("/api/auth/signin", {
        email,
        password,
      });

      if (res.data?.success && res.data?.data?.user) {
        setUser(res.data.data.user);
        toast.success("Signed in successfully");
        return;
      }

      throw new Error(res.data?.message || "Sign in failed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to sign in");
      throw error;
    }
  };

  /* ===============================
     Sign Up
  ================================ */
  const signUp = async (
    email: string,
    name: string,
    password: string
  ) => {
    try {
      const res = await api.post("/api/auth/signup", {
        email,
        name,
        password,
      });

      if (res.data?.success && res.data?.data?.user) {
        setUser(res.data.data.user);
        toast.success("Account created successfully");
        return;
      }

      throw new Error(res.data?.message || "Sign up failed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create account");
      throw error;
    }
  };

  /* ===============================
     Update profile
  ================================ */
  const updateProfile = async (name: string) => {
    try {
      const res = await api.put("/api/auth/me", { name });

      if (res.data?.success && res.data?.data?.user) {
        setUser(res.data.data.user);
        toast.success("Profile updated successfully");
        return;
      }

      throw new Error(res.data?.message || "Update failed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    }
  };

  /* ===============================
     Change password
  ================================ */
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await api.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password changed. Please sign in again.");
      await signOut();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Password change failed");
      throw error;
    }
  };

  /* ===============================
     Delete account
  ================================ */
  const deleteAccount = async (password: string) => {
    try {
      const res = await api.delete("/api/auth/delete-account", {
        data: { password },
      });

      if (res.data?.success) {
        setUser(null);
        toast.success("Account deleted permanently");
        return;
      }

      throw new Error(res.data?.message || "Delete failed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      throw error;
    }
  };

  /* ===============================
     Sign Out
  ================================ */
  const signOut = async () => {
    try {
      await api.post("/api/auth/signout");
      setUser(null);
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Sign out failed");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
        updateProfile,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
