import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";

import MainLayout from "./components/layout/MainLayout";

import { ChangePasswordPage } from "./pages/auth/ChangePasswordPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

import Dashboard from "./pages/Dashboard";

import { UserDetailsPage } from "./pages/user/UserDetailsPage";
import { UserFormPage } from "./pages/user/UserFormPage";
import { UsersListPage } from "./pages/user/UsersListPage";

import KycPage from "./pages/KycPage";
import ProvincesPage from "./pages/ProvincesPage";
import MunicipalitiesPage from "./pages/MunicipalitiesPage";
import DistrictsPage from "./pages/DistrictsPage";

function AppLayout() {
  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />

            <Route path="/users" element={<UsersListPage />} />
            <Route path="/users/new" element={<UserFormPage />} />
            <Route path="/users/:id" element={<UserDetailsPage />} />
            <Route path="/users/:id/edit" element={<UserFormPage />} />

            <Route path="/kyc" element={<KycPage />} />

            <Route path="/provinces" element={<ProvincesPage />} />

            <Route path="/municipalities" element={<MunicipalitiesPage />} />

            <Route path="/districts" element={<DistrictsPage />} />

            <Route path="/change-password" element={<ChangePasswordPage />} />

            <Route path="/logout" element={<Navigate to="/login" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
