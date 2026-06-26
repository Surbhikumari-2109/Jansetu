import axios from "axios";

const API =
  "${import.meta.env.VITE_API_BASE_URL}/api/complaints";

export const getMyComplaints =
  async (token) => {
    const response = await axios.get(
      `${API}/my-complaints`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };