import axios from "axios";

export const uploadFiles = async (data) => {
  const API_URL = "http://localhost:5000";

  try {
    let response = await axios.post(`${API_URL}/api/files`, data);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error while calling the api ", error.message);
  }
};
