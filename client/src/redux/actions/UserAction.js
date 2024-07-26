import axios from "axios";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";

// Action to handle login
export const login = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:8085/auth/login", {
      username,
      password,
    });

    if (response.status === 200) {
      localStorage.setItem("token", response.data["access-token"]);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data,
      });
      console.log("Login successful", response.data["access-token"]);
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.message,
    });
  }
};

// Action to handle logout
export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({
    type: LOGOUT,
  });
};
