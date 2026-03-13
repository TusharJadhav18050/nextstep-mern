import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./index.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import HomePage           from "./pages/HomePage";
import JobsPage           from "./pages/JobsPage";
import JobDetailPage      from "./pages/JobDetailPage";
import CompaniesPage      from "./pages/CompaniesPage";
import CompanyPage        from "./pages/CompanyPage";
import AddJobPage         from "./pages/AddJobPage";
import AddCompanyPage     from "./pages/AddCompanyPage";
import LoginPage          from "./pages/LoginPage";
import RegisterPage       from "./pages/RegisterPage";
import AboutPage          from "./pages/AboutPage";
import ContactPage        from "./pages/ContactPage";
import PrivacyPage        from "./pages/PrivacyPage";
import TermsPage          from "./pages/TermsPage";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import SeekerDashboard    from "./pages/SeekerDashboard";

NProgress.configure({ showSpinner: false });

function ProgressBar() {
  const location = useLocation();
  useEffect(() => {
    NProgress.start();
    const t = setTimeout(() => NProgress.done(), 400);
    return () => clearTimeout(t);
  }, [location]);
  return null;
}

function AuthOnly({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RecruiterOnly({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "recruiter") return <Navigate to="/" replace />;
  return children;
}

function GuestOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === "recruiter" ? "/recruiter-dashboard" : "/my-dashboard"} replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ProgressBar />
        <Toaster position="top-right" />
        <Header />
        <Routes>

          {/* Public */}
          <Route path="/" element={<HomePage />} />

          {/* Guest only */}
          <Route path="/login"    element={<GuestOnly><LoginPage /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

          {/* Must be logged in */}
          <Route path="/jobs"             element={<AuthOnly><JobsPage /></AuthOnly>} />
          <Route path="/job/:slug"        element={<AuthOnly><JobDetailPage /></AuthOnly>} />
          <Route path="/companies"        element={<AuthOnly><CompaniesPage /></AuthOnly>} />
          <Route path="/company/:slug"    element={<AuthOnly><CompanyPage /></AuthOnly>} />
          <Route path="/about-us"         element={<AuthOnly><AboutPage /></AuthOnly>} />
          <Route path="/contact-us"       element={<AuthOnly><ContactPage /></AuthOnly>} />
          <Route path="/privacy-policy"   element={<AuthOnly><PrivacyPage /></AuthOnly>} />
          <Route path="/terms-conditions" element={<AuthOnly><TermsPage /></AuthOnly>} />
          <Route path="/my-dashboard"     element={<AuthOnly><SeekerDashboard /></AuthOnly>} />

          {/* Recruiter only */}
          <Route path="/add-job"             element={<RecruiterOnly><AddJobPage /></RecruiterOnly>} />
          <Route path="/add-company"         element={<RecruiterOnly><AddCompanyPage /></RecruiterOnly>} />
          <Route path="/recruiter-dashboard" element={<RecruiterOnly><RecruiterDashboard /></RecruiterOnly>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}