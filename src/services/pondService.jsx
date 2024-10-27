import api from "../configs/axios";

export const updatePond = async (data) => {
  try {
    const response = await api.put("/ponds", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createPond = async (data) => {
  try {
    const response = await api.post("/ponds", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllPonds = async (userId) => {
  try {
    const response = await api.get(`/ponds/${userId}`); //sua lai cho dung
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
