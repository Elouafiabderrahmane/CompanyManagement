import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "../actions/UserAction";

const initialState = {
  isAuthenticated: true, //// change to false when done testing
  user: null,
  error: null,
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log("LOGIN_SUCCESS action received");
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default UserReducer;
