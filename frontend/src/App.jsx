import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useRef } from "react";
import useAuthStore from "./store/authStore";

const AuthPage = lazy(() => import("./pages/AuthPage"));
const Home = lazy(() => import("./pages/Home"));
const News = lazy(() => import("./pages/News"));
const Events = lazy(() => import("./pages/Events"));

function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return children;
}

function App() {
  const hasRunInit = useRef(false);
  const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);

  useEffect(() => {
    if (!hasRunInit.current) {
      hasRunInit.current = true;
      useAuthStore.getState().initialize();
    }
  }, []);

  if (!hasCheckedAuth) {
    return 
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<GuestRoute><AuthPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><AuthPage /></GuestRoute>} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;