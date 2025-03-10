import api from "./api";
import { AuthUser, ProfileUpdateData, PasswordUpdateData } from "@/types";

// Get all members (admin only)
export const getAllMembers = async (): Promise<AuthUser[]> => {
  try {
    const response = await api.get("/members");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get member by ID
export const getMemberById = async (id: string): Promise<AuthUser> => {
  try {
    const response = await api.get(`/members/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update member
export const updateMember = async (
  id: string,
  data: ProfileUpdateData
): Promise<AuthUser> => {
  try {
    const response = await api.put(`/members/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update password
export const updatePassword = async (
  id: string,
  data: PasswordUpdateData
): Promise<boolean> => {
  try {
    const response = await api.put(`/members/${id}/password`, data);
    return response.data.success;
  } catch (error) {
    throw error;
  }
};

// Delete member (admin only)
export const deleteMember = async (id: string): Promise<boolean> => {
  try {
    const response = await api.delete(`/members/${id}`);
    return response.data.success;
  } catch (error) {
    throw error;
  }
};
