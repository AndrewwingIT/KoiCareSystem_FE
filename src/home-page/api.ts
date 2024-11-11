import axios from "axios";

export const API_SERVER = "https://localhost:7239/";

export const deletePond = async (pondId: any) => {
  try {
    const rs = await axios.delete<any>(`${API_SERVER}api/ponds/${pondId}`);
    return rs.data;
  } catch (error) {
    console.error("Error in delete pond:", error);
    throw error; // Rethrow the error to be handled in onFinish
  }
}

export const getAllPonds = async (userId: any) => {
  try {
    const rs = await axios.get<any>(`${API_SERVER}api/ponds/${userId}`);
    return rs.data;
  } catch (error) {
    console.error("Error in get waterparam:", error);
    throw error; // Rethrow the error to be handled in onFinish
  }
}

export const createPond = async (value: any) => {
  console.log("VALUE: ", value);

  try {
    const rs = await axios.post<any>(`${API_SERVER}api/ponds`, value);
    return rs.data;
  } catch (error) {
    console.error("Error in add waterparam:", error);
    throw error; // Rethrow the error to be handled in onFinish
  }
};
export const updatePond = async (value: any) => {
  try {
    const rs = await axios.put<any>(`${API_SERVER}api/ponds`, value);
    return rs.data;
  } catch (error) {
    console.error("Error in add waterparam:", error);
    throw error; // Rethrow the error to be handled in onFinish
  }
};

export const updateWaterParameter = async (value: any) => {
  try {
    const rs = await axios.put<any>(`${API_SERVER}api/...`, {
      // email,
      // password,
    });
    return rs.data;
  } catch (error) {
    console.error("Error in add waterparam:", error);
    throw error; // Rethrow the error to be handled in onFinish
  }
};

export const addWaterParameter = async (value: any) => {
  try {
    const rs = await axios.post<any>(`${API_SERVER}api/water-parameters`, value); // Directly pass 'value' here
    return rs.data;
  } catch (error) {
    console.error("Error in add waterparam:", error);
    throw error; // Rethrow the error to be handled in onFinish
  }
};

export const getAllWaterParametersByUserId = async (userId: any) => {
  try {
    const rs = await axios.get<any>(`${API_SERVER}api/water-parameters/user/${userId}`);
    return rs.data;
  } catch (error) {
    console.error("Error in get waterparam:", error);
    throw error; // Rethrow the error to be handled in onFinish
  }
}

export const getAllWaterParametersByPondId = async (pondId: any) => {
  try {
    const rs = await axios.get<any>(`${API_SERVER}api/water-parameters/pond/${pondId}`);
    return rs.data;
  } catch (error) {
    console.error("Error in get waterparam:", error);
    throw error; // Rethrow the error to be handled in onFinish
  }
}

export const login = async (email: string, password: string) => {
  try {
    const rs = await axios.post<any>(`${API_SERVER}api/authentication/login`, {
      email,
      password,
    });
    return rs.data;
  } catch (error) {
    console.error("Error in login:", error);
    throw error; // Rethrow the error to be handled in onFinish
  }
};


export const register = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  address: string
) => {
  try {
    const rs = await axios.post<any>(`${API_SERVER}api/authentication/register`, {
      name,
      email,
      password,
      phone,
      address
    });
    return rs.data;
  } catch (error) {
    console.error("Error in register function:", error);
    throw error; // Rethrow the error to be caught in onFinish
  }
};

export const addKoi = async (formData: FormData) => {
  try {
    const rs = await axios.post(`${API_SERVER}api/kois`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(rs.data);
    return rs.data;
  } catch (error) {
    console.error("Error in addKoi:", error);
    throw error;
  }
};


export const addPond = async (value: any) => {
  console.log(value);
  try {
    const rs = await axios.post(`${API_SERVER}api/ponds`, {
      pondId: 0,
      userId: 3,
      name: value.name,
      depth: value.depth,
      volume: value.volume,
      pumpCapacity: value.pumpCapacity,
      image: value.image,
    });
    console.log(rs.data);
    return rs.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteWaterParameter = async (paramId: number) => {
  return await axios.delete(`${API_SERVER}/api/water-parameters/${paramId}`);
};
