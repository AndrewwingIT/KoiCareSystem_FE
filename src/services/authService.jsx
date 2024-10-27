import { message } from "antd";
import api from "../configs/axios";

export const login = async (data) => {
  try {
    const response = await api.post("/authentication/login", data);

    return response.data;
  } catch (error) {
    if (error.status === 401) {
      message.info(`Please check your email ${data.email}`);
    }
  }
};

export const register = async (data) => {
  const response = await api.post("/authentication/register", data);
  message.success(response.data.message);
  return response.data;
};
