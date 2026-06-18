import axios from "axios";

const API =
  "http://localhost:5000/api/complaints";

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