import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import useAuthStore from "./store/authStore";
import ProtectedRoute from "./utils/ProtectedRoute";

const AuthPage = lazy(() => import("./pages/AuthPage"));
const Home = lazy(() => import("./pages/Home"));

function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return children;
}

function App() {
  return (
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          {/* Homepage ALWAYS visible */}
          <Route path="/home" element={<Home />} />

          {/* Login (guest-only) */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <AuthPage />
              </GuestRoute>
            }
          />

          {/* Register (guest-only) */}
          <Route
            path="/register"
            element={
              <GuestRoute>
                <AuthPage />
              </GuestRoute>
            }
          />

          {/* Redirect root → homepage */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Catch-all redirect */}
          <Route path="/*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
  );
}

export default App;
