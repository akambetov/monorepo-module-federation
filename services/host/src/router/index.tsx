import { App } from "@/components/App";
import { createBrowserRouter } from "react-router-dom";
// @ts-ignore
import shopRoutes from 'shop/router';
// @ts-ignore
import adminRoutes from 'admin/router';

export const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        ...shopRoutes,
        ...adminRoutes
      ],
    },
  ]);