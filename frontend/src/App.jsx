import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import useAuthStore from "./store/authStore";

const AuthPage = lazy(() => import("./pages/AuthPage"));

function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <AuthPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <AuthPage />
            </GuestRoute>
          }
        />

        {/* Redirect everything else to login for now */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
