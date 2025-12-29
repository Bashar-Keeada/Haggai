import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Programs from "./pages/Programs";
import EventCalendar from "./pages/EventCalendar";
import Membership from "./pages/Membership";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/om-oss" element={<AboutUs />} />
            <Route path="/utbildningar" element={<Programs />} />
            <Route path="/kalender" element={<EventCalendar />} />
            <Route path="/bli-medlem" element={<Membership />} />
            <Route path="/kontakt" element={<Contact />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
