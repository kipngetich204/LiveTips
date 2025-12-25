import { Navbar } from "./components/Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { AuthService } from "./services/auth-service";
import { SignIn } from "./components/Authentication/signIn";
import { SignUp } from "./components/Authentication/signUp";
import { ResetPassword } from "./components/Authentication/ResetPassword";
import { Tips } from "./pages/Tips/Tips";
import { Footer } from "./components/footer";
import type { User } from "./types/user";
import './index.css'
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Premium } from "./pages/Tips/Premium";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { PrivateRoute } from "./services/Private";
import { NotFound } from "./pages/NotFound";
import { LiveScore } from "./pages/Livescore";
import { Marquee } from "./pages/marquue";
import { Logo } from "./assets/logo";
//import { ErrorPage } from "./pages/Error";

type ModalType = "signin" | "signup" | "reset" | null;

export default function App() {
  const { user, loading } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      const interval = setInterval(async () => {
        // const totalSeconds = await AuthService.getTotalSessionTime(user.uid);
        // If you want to show session time, restore sessionTime state and use this line
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCurrentUser(null);
    }
  }, [user]);

  const handleSignIn = (userData: User) => {
    setCurrentUser(userData);
    setActiveModal(null);
  };

  const handleSignUp = (userData: User) => {
    setCurrentUser(userData);
    setActiveModal(null);
  };

  const handleSignOut = async () => {
    await AuthService.signOut();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Logo />
      </div>
    );
  }

  return (
    <>
      {/* Navbar - Always at the top */}
      <Navbar
        currentUser={currentUser}
        isLoggedIn={!!currentUser}
        onLoginClick={() => setActiveModal("signin")}
        onSignUpClick={() => setActiveModal("signup")}
        onLogout={handleSignOut}
      />
      <div className="h-2 md:h-2 bg-white"></div>
      {/* Main Content - Add padding to account for fixed navbar */}
      <main className="border-t-red-200 pt-16 md:pt-20 w-full">
        {/* Marquee - Appears on all pages */}
        
        
        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/basic" element={<Tips />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/livescore" element={<LiveScore />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute requireAdmin={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Marquee />
      {/* Footer - Always at the bottom */}
      <Footer />

      {/* Modals - Appear above everything */}
      {activeModal === "signin" && (
        <SignIn
          onSwitchToSignUp={() => setActiveModal("signup")}
          onSwitchToResetPassword={() => setActiveModal("reset")}
          onSignIn={handleSignIn}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "signup" && (
        <SignUp
          onSwitchToSignIn={() => setActiveModal("signin")}
          onSignUp={handleSignUp}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "reset" && (
        <ResetPassword
          onSwitchToSignIn={() => setActiveModal("signin")}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}