import api from "./api";
import { LoginCredentials, RegisterData, AuthUser } from "@/types";

// Login user
export const login = async (
  credentials: LoginCredentials
): Promise<AuthUser> => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register user
export const register = async (userData: RegisterData): Promise<AuthUser> => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
