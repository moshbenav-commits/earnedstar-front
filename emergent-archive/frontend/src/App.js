import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import AuditPage from "./pages/AuditPage";
import YotpoRefugeesPage from "./pages/YotpoRefugeesPage";
import StorePage from "./pages/StorePage";
import ModerationLedger from "./pages/ModerationLedger";
import DashboardPage from "./pages/DashboardPage";
import BrandPage from "./pages/BrandPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/yotpo-refugees" element={<YotpoRefugeesPage />} />
          <Route path="/store/:slug" element={<StorePage />} />
          <Route path="/store/:slug/moderation" element={<ModerationLedger />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/brand" element={<BrandPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
