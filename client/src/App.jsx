import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import StudyPage from "./pages/StudyPage";
import QuizPage from "./pages/QuizPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { StudyHubPage, QuizHubPage } from "./pages/HubPages";

const SIDEBAR_PAGES = ["/dashboard", "/upload", "/study", "/quiz", "/profile", "/settings"];

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Manrope, sans-serif", color: "#737784" }}>
        Loading…
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function Layout() {
  // useLocation re-renders on every navigation — unlike window.location.pathname
  const { pathname } = useLocation();
  const hasSidebar = SIDEBAR_PAGES.some(p => pathname.startsWith(p));

  return (
    <>
      {!hasSidebar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/upload" element={<RequireAuth><UploadPage /></RequireAuth>} />
        <Route path="/study" element={<RequireAuth><StudyHubPage /></RequireAuth>} />
        <Route path="/study/:id" element={<RequireAuth><StudyPage /></RequireAuth>} />
        <Route path="/quiz" element={<RequireAuth><QuizHubPage /></RequireAuth>} />
        <Route path="/quiz/:id" element={<RequireAuth><QuizPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
