import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import EventCalendar from "./pages/EventCalendar";
import Membership from "./pages/Membership";
import Contact from "./pages/Contact";
import LeaderExperience from "./pages/LeaderExperience";
import LeaderExperienceApplication from "./pages/LeaderExperienceApplication";
import Leaders from "./pages/Leaders";
import AdminLeaders from "./pages/AdminLeaders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBoardMembers from "./pages/AdminBoardMembers";
import AdminOrganizationMembers from "./pages/AdminOrganizationMembers";
import AdminPartners from "./pages/AdminPartners";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminNominations from "./pages/AdminNominations";
import AdminWorkshops from "./pages/AdminWorkshops";
import AdminTrainingParticipants from "./pages/AdminTrainingParticipants";
import MembersArea from "./pages/MembersArea";
import Partners from "./pages/Partners";
import Donations from "./pages/Donations";
import LoginPage from "./pages/LoginPage";
import NomineeRegistration from "./pages/NomineeRegistration";

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public route - no auth required */}
              <Route path="/registrering/:nominationId" element={<NomineeRegistration />} />
              {/* All other routes handled by ProtectedApp */}
              <Route path="/*" element={<ProtectedAppContent />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </LanguageProvider>
    </div>
  );
}

// Protected content component
const ProtectedAppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="w-12 h-12 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/om-oss" element={<AboutUs />} />
        <Route path="/leader-experience" element={<LeaderExperience />} />
        <Route path="/leader-experience/:programId" element={<LeaderExperienceApplication />} />
        <Route path="/kalender" element={<EventCalendar />} />
        <Route path="/bli-medlem" element={<Membership />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/ledare" element={<Leaders />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/donera" element={<Donations />} />
        <Route path="/medlemmar" element={<MembersArea />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/ledare" element={<AdminLeaders />} />
        <Route path="/admin/styrelse" element={<AdminBoardMembers />} />
        <Route path="/admin/medlemmar" element={<AdminOrganizationMembers />} />
        <Route path="/admin/partners" element={<AdminPartners />} />
        <Route path="/admin/vittnesmal" element={<AdminTestimonials />} />
        <Route path="/admin/nomineringar" element={<AdminNominations />} />
        <Route path="/admin/workshops" element={<AdminWorkshops />} />
      </Routes>
    </Layout>
  );
};

export default App;
