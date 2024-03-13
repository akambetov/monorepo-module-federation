import { App } from "@/components/App";
import { LazyShop } from "@/pages/shop/ShopLazy";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { shopUrls } from "@packages/shared";

const routes = [
  {
    path: '/',
    element: <Navigate to={shopUrls.main} />
  },
  {
    path: shopUrls.root,
    element: <App />,
    children: [
      { path: shopUrls.main, element: <LazyShop /> },
      { path: shopUrls.second, element: <div>Second</div> },
    ],
  },
]

export const router = createBrowserRouter(routes);

export default routes