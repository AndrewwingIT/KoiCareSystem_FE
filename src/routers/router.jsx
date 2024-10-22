import { Link, Navigate, Outlet, createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/Customer/HomePage/HomePage";

import Login from "../pages/shared/LoginAccount/login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [],
  },
  {
    path: "Login",
    element: <Login />,
  },

  {
    path: "Register",
    element: <Register />,
  },
]);
