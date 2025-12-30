import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Programs from "./pages/Programs";
import EventCalendar from "./pages/EventCalendar";
import Membership from "./pages/Membership";
import Contact from "./pages/Contact";
import LeaderExperience from "./pages/LeaderExperience";
import LeaderExperienceApplication from "./pages/LeaderExperienceApplication";

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/om-oss" element={<AboutUs />} />
              <Route path="/utbildningar" element={<Programs />} />
              <Route path="/leader-experience" element={<LeaderExperience />} />
              <Route path="/leader-experience/:programId" element={<LeaderExperienceApplication />} />
              <Route path="/kalender" element={<EventCalendar />} />
              <Route path="/bli-medlem" element={<Membership />} />
              <Route path="/kontakt" element={<Contact />} />
            </Routes>
          </Layout>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </LanguageProvider>
    </div>
  );
}

export default App;
