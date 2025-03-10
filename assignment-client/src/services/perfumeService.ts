import api from "./api";
import { Perfume, CommentFormData } from "@/types";

// Get all perfumes
export const getAllPerfumes = async (): Promise<Perfume[]> => {
  try {
    const response = await api.get("/perfumes");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get perfume by ID
export const getPerfumeById = async (id: string): Promise<Perfume> => {
  try {
    const response = await api.get(`/perfumes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search perfumes by keyword
export const searchPerfumes = async (keyword: string): Promise<Perfume[]> => {
  try {
    const response = await api.get(`/perfumes/search/${keyword}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Filter perfumes by brand
export const filterPerfumesByBrand = async (
  brandId: string
): Promise<Perfume[]> => {
  try {
    const response = await api.get(`/perfumes/brand/${brandId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create perfume
export const createPerfume = async (
  data: Partial<Perfume>
): Promise<Perfume> => {
  try {
    const response = await api.post("/perfumes", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update perfume
export const updatePerfume = async (
  id: string,
  data: Partial<Perfume>
): Promise<Perfume> => {
  try {
    const response = await api.put(`/perfumes/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete perfume
export const deletePerfume = async (id: string): Promise<boolean> => {
  try {
    const response = await api.delete(`/perfumes/${id}`);
    return response.data.success;
  } catch (error) {
    throw error;
  }
};

// Add comment to perfume
export const addComment = async (
  perfumeId: string,
  data: CommentFormData
): Promise<Perfume> => {
  try {
    const response = await api.post(`/perfumes/${perfumeId}/comments`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete comment from perfume
export const deleteComment = async (
  perfumeId: string,
  commentId: string
): Promise<Perfume> => {
  try {
    const response = await api.delete(
      `/perfumes/${perfumeId}/comments/${commentId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
