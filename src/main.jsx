import "./index.css";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Customers from "./Pages/Customers/Customers";
import Roles from "./Pages/Roles/Roles";
import User from "./Pages/User/User";
import { GlobalProvider } from "./Context/GlobalContext";
import Login from "./Login/Login";
import Categories from "./Pages/Categories/Categories";
import Products from "./Pages/Products/Products";
import Attributes from "./Pages/Attributes/Attributes";
import Discounts from "./Pages/Discounts/Discounts";
import Orders from "./Pages/Orders/Orders";
import OrderView from "./Pages/OrderView/OrderView";
import Homepage from "./Pages/OtherPages/Homepage";
import OtherPages from "./Pages/OtherPages/OtherPages";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <User />,
      },
      {
        path: "roles",
        element: <Roles />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "attributes",
        element: <Attributes />,
      },
      {
        path: "discounts",
        element: <Discounts />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "homepages",
        element: <Homepage />,
      },
      {
        path: "pages",
        element: <OtherPages />,
      },
      {
        path: "orders/view/:id",
        element: <OrderView />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </ConfigProvider>
);
