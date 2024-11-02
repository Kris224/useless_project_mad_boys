import * as React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          element={<HomePage />}
          path="/"
        />
        <Route
          element={<LoginPage />}
          path="/login"
        />
        <Route
          element={<SignupPage />}
          path="/signup"
        />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
