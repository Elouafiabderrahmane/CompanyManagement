import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";
import { createStore, applyMiddleware } from "redux";import rootReducer from "./redux/reducers";
import { BrowserRouter } from "react-router-dom";

import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./assets/css/grid.css";
import "./assets/css/theme.css";
import "./assets/css/index.css";

import Layout from "./components/layout/Layout";

const store = createStore(rootReducer, applyMiddleware(thunk));

document.title = "Company Management";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
