import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/login/login';
import NotFound from './pages/not-found';
import { ProtectedRoute } from './components/ProtectedRoute';
import UsersPage from './pages/users';
import ProfilePage from './pages/profile';
import AuthCallback from './pages/auth/callback';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages';
import OBFPage from "./pages/obf";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "./components/layouts/dashboard/layout";
import { Dashboard } from "./pages/dashboard";
import Masters from "./pages/masters";
import OBFList from './pages/obf';
import { OBFView } from './pages/obf/id';
import OBFInput from './pages/obf/id/input';
import OBFWorking from './pages/obf/id/working';
import OBFCostBreakup from './pages/obf/id/cost-breakup';
import OBFFinal from './pages/obf/id/final';
import { DashboardLayoutWrapper } from './components/layouts/dashboard-layout-wrapper';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />
  },
  {
    path: "/",
    element: <DashboardLayout><Home /></DashboardLayout>,
  },
  {
    path: "/users",
    element: <DashboardLayout><ProtectedRoute><UsersPage /></ProtectedRoute></DashboardLayout>,
  },
  {
    path: "/profile",
    element: <DashboardLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></DashboardLayout>,
  },
  {
    path: "/obf/:id/input",
    element: <DashboardLayout><ProtectedRoute><OBFInput /></ProtectedRoute></DashboardLayout>,
  },
  {
    path: "/obf/:id/working",
    element: <DashboardLayout><ProtectedRoute><OBFWorking /></ProtectedRoute></DashboardLayout>,
  },
  {
    path: "/obf/:id/cost-breakup",
    element: <DashboardLayout><ProtectedRoute><OBFCostBreakup /></ProtectedRoute></DashboardLayout>,
  },
  {
    path: "/obf/:id/final",
    element: <DashboardLayout><ProtectedRoute><OBFFinal /></ProtectedRoute></DashboardLayout>,
  },
  {
    path: "/obf/:id",
    element: <DashboardLayout><ProtectedRoute><OBFView /></ProtectedRoute></DashboardLayout>,
  },
  {
    path: "/obf",
    element: <DashboardLayout><ProtectedRoute><OBFList /></ProtectedRoute></DashboardLayout>,
  },
  {
    path: "/masters",
    element: <DashboardLayout><ProtectedRoute><Masters /></ProtectedRoute></DashboardLayout>,
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}

export const RouterWithAuth = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);