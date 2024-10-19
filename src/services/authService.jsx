import { message } from "antd";
import api from "../configs/axios";

export const login = async (data) => {
  const response = await api.post("/authentication/login", data);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post("/authentication/register", data);
  message.success(response.data.message);
  return response.data;
};
