import api from "./api";
import { Brand } from "@/types";

// Get all brands
export const getAllBrands = async (): Promise<Brand[]> => {
  try {
    const response = await api.get("/brands");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get brand by ID
export const getBrandById = async (id: string): Promise<Brand> => {
  try {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create brand
export const createBrand = async (data: {
  brandName: string;
}): Promise<Brand> => {
  try {
    const response = await api.post("/brands", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update brand
export const updateBrand = async (
  id: string,
  data: { brandName: string }
): Promise<Brand> => {
  try {
    const response = await api.put(`/brands/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete brand
export const deleteBrand = async (id: string): Promise<boolean> => {
  try {
    const response = await api.delete(`/brands/${id}`);
    return response.data.success;
  } catch (error) {
    throw error;
  }
};
