// src/configs/apiConfig.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  GET_USER: `${API_BASE_URL}/users/profile`,
  // Thêm các endpoint khác ở đây
};
