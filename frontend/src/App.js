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
import AdminWorkshopAgenda from "./pages/AdminWorkshopAgenda";
import AdminTrainingParticipants from "./pages/AdminTrainingParticipants";
import AdminEvaluationQuestions from "./pages/AdminEvaluationQuestions";
import AdminEvaluationResults from "./pages/AdminEvaluationResults";
import SessionEvaluationForm from "./pages/SessionEvaluationForm";
import MembersArea from "./pages/MembersArea";
import Partners from "./pages/Partners";
import Donations from "./pages/Donations";
import LoginPage from "./pages/LoginPage";
import NomineeRegistration from "./pages/NomineeRegistration";
import PublicAgenda from "./pages/PublicAgenda";
import LeaderSessions from "./pages/LeaderSessions";
import PublicNominationForm from "./pages/PublicNominationForm";
// Leader Portal Pages
import LeaderRegistrationForm from "./pages/LeaderRegistrationForm";
import LeaderLogin from "./pages/LeaderLogin";
import LeaderPortal from "./pages/LeaderPortal";
// Member Portal Pages
import MemberLogin from "./pages/MemberLogin";
import MinaSidor from "./pages/MinaSidor";
import MemberProfile from "./pages/MemberProfile";
import MemberDirectory from "./pages/MemberDirectory";
import MemberMessages from "./pages/MemberMessages";
import MemberForum from "./pages/MemberForum";
import MemberDiplomas from "./pages/MemberDiplomas";

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes - no auth required */}
              <Route path="/registrering/:nominationId" element={<NomineeRegistration />} />
              <Route path="/medlem-login" element={<MemberLogin />} />
              <Route path="/program/:workshopId" element={<PublicAgenda />} />
              <Route path="/ledare/:leaderId/sessioner" element={<LeaderSessions />} />
              <Route path="/utvardering/:workshopId/:sessionId" element={<SessionEvaluationForm />} />
              <Route path="/nominera/:workshopId" element={<PublicNominationForm />} />
              {/* Member Portal Routes */}
              <Route path="/mina-sidor" element={<MinaSidor />} />
              <Route path="/mina-sidor/profil" element={<MemberProfile />} />
              <Route path="/mina-sidor/medlemmar" element={<MemberDirectory />} />
              <Route path="/mina-sidor/meddelanden" element={<MemberMessages />} />
              <Route path="/mina-sidor/meddelanden/:partnerId" element={<MemberMessages />} />
              <Route path="/mina-sidor/forum" element={<MemberForum />} />
              <Route path="/mina-sidor/forum/:postId" element={<MemberForum />} />
              <Route path="/mina-sidor/diplom" element={<MemberDiplomas />} />
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
        <Route path="/admin/workshops/:workshopId/agenda" element={<AdminWorkshopAgenda />} />
        <Route path="/admin/utbildning" element={<AdminTrainingParticipants />} />
        <Route path="/admin/utvardering/fragor" element={<AdminEvaluationQuestions />} />
        <Route path="/admin/utvardering" element={<AdminEvaluationResults />} />
      </Routes>
    </Layout>
  );
};

export default App;
