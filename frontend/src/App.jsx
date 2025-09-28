// src/App.jsx
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { UserProvider } from "./app/UserProvider.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./app/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          {/* veřejná login stránka */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* všechno ostatní chráněné */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
