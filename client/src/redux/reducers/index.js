// redux/reducers/index.js
import { combineReducers } from "redux";
import ThemeReducer from "./ThemeReducer";
import UserReducer from "./UserReducer"; // Import UserReducer

const rootReducer = combineReducers({
  ThemeReducer,
  UserReducer, // Include UserReducer
});

export default rootReducer;
