import { App } from "@/components/App";
import { LazyAbout } from "@/pages/about/AboutLazy";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { adminUrls } from '@packages/shared'

const routes = [
  
  {
    path: '/',
    element: <Navigate to={adminUrls.about} />
  },  
  {
      path: adminUrls.root,
      element: <App />,
      children: [
        { path: adminUrls.about, element: <LazyAbout /> },
      ],
    },
  ]

export const router = createBrowserRouter(routes);

export default routes