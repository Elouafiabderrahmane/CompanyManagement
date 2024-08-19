import jwtDecode from "jwt-decode";
import { LOGIN_SUCCESS, LOGOUT } from "../actions/UserAction";

export const RESTORE_USER = "RESTORE_USER";

export const restoreUser = () => (dispatch) => {
    const token = localStorage.getItem("token");

    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        if (decodedToken.exp < currentTime) {
            // Token has expired, dispatch logout action
            dispatch({ type: LOGOUT });
        } else {
            // Token is valid, restore the user
            dispatch({
                type: LOGIN_SUCCESS,
                payload: decodedToken, // Assumes token contains user data
            });
        }
    }
};
