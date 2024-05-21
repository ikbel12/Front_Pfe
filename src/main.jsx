import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";
// Assurez-vous que le chemin vers votre store est correct
import SignInSide from "./page/auth/SignInSide";
import SignUp from "./page/auth/SignUp";
import App from "./App";
import Dashboard from "./page/dashboard/Dashboard";
import Team from "./page/team/Team";
import Client from "./page/client/Client";
import Supplier from "./page/supplier/Supplier";
import BarChart from "./page/barChart/BarChart";
import PieChart from "./page/pieChart/PieChart";
import LineChart from "./page/lineChart/LineChart";
import NotFound from "./page/notFound/NotFound";
import ResetPasswordForm from "./page/auth/ResetPasswordForm";
import ProfilePage from "./page/profile/ProfilePage";
import Subscriptions from "./page/subscriptions/Subscriptions";
import ReclamationForm from "./page/reclamation/ReclamationForm";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import SettingAlert from "./page/settingalert/SettingAlert";
import ChangePassword from "./page/auth/ChangePassword";
 import PermessionUser from "./page/permession/PermessionUser";

function ProtectedRoute({ children }) {
  // @ts-ignore
  const user = useSelector((state) => state.user?.userInfo);
  console.log(user);
  return user ? children : <Navigate to="/" />;
}

function ProtectAdminRoute({ children }) {
  // @ts-ignore
  const user = useSelector((state) => state.user?.userInfo);
  return user?.isAdmin ? children : <Navigate to="/home" />;
}

// Then use it like this:
const routes = (
  <Routes>
    <Route path="/" element={<SignInSide />} />
    <Route path="/ResetPasswordForm" element={<ResetPasswordForm />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/set-password" element={<ChangePassword />} />

    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      }
    >
      <Route
        index
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="team"
        element={
          <ProtectedRoute>
            <ProtectAdminRoute>
              <Team />
            </ProtectAdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="alertsetting"
        element={
          <ProtectedRoute>
            <SettingAlert />
          </ProtectedRoute>
        }
      />
      <Route
        path="subscriptions"
        element={
          <ProtectedRoute>
            <Subscriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="client"
        element={
          <ProtectedRoute>
            <Client />
          </ProtectedRoute>
        }
      />
      <Route
        path="supplier"
        element={
          <ProtectedRoute>
            <Supplier />
          </ProtectedRoute>
        }
      />
      <Route
        path="reclamation"
        element={
          <ProtectedRoute>
            <ReclamationForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
          <Route
        path="permession"
        element={
          <ProtectedRoute>
            <PermessionUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="bar"
        element={
          <ProtectedRoute>
            <BarChart />
          </ProtectedRoute>
        }
      />
      <Route
        path="pie"
        element={
          <ProtectedRoute>
            <PieChart />
          </ProtectedRoute>
        }
      />
      <Route
        path="line"
        element={
          <ProtectedRoute>
            <LineChart />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>{routes}</BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
