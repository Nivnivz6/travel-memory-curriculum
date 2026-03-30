import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { TopNavBar } from "./components/TopNavBar";
import { Gallery } from "./components/Gallery";
import { Analytics } from "./components/Analytics";
import { Login, SignUp } from "./components/Auth";
import { AnimatePresence, motion } from "motion/react";
import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-surface">
      {!isAuthPage && <TopNavBar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Gallery />
              </motion.div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/analytics"
            element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Analytics />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
