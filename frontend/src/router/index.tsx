import { createHashRouter } from "react-router";

import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";

export const router = createHashRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);