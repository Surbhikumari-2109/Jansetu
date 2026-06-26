import axios from "axios";

const API =
  "https://jansetu-eta0.onrender.com/api/complaints";

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