import * as React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { getAccessToken } from "./auth/authservice";

const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  console.log("Access Token:", token); // Debugging log to check if the token is being retrieved correctly
  return !!token; // Return true if there is an access token
};

// Private Route component to protect routes
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = isAuthenticated();
  return auth ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace /> // Redirect to login if not authenticated
  );
};

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Protected HomePage Route */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
