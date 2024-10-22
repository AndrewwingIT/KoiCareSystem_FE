import api from "../configs/axios";

export const getAllPonds = async () => {
  try {
    const response = await api.get("/api/ponds"); //sua lai cho dung
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
