import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Skills } from "./pages/Skills";
import { Goals } from "./pages/Golas";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/skills",
    Component: Skills,
  },
  {
    path: "/goals",
    Component: Goals
  }
]);
