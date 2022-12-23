import React from "react";
import ReactDOM from "react-dom/client";
import Collection from "./pages/Collection"
import Layout from "./components/Layout"
import Wallet from "./pages/Wallet"
import Mint from "./pages/Mint"
import ErrorPage from "./pages/Error"
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/collection",
        element: <Collection />,
      },
      {
        path: "/wallet",
        element: <Wallet />,
      },
      {
        path: "/mint",
        element: <Mint />,
      },
      {
        path: "/withdraw",
        element: <Collection />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
reportWebVitals();
