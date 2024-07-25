import axios from "axios";

export const fetchUserData = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:8085/api/user"); // Replace with your API endpoint
    dispatch({ type: "SET_USER", payload: response.data });
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
