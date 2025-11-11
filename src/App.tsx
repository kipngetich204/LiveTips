import { Navbar } from "./components/Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { AuthService } from "./services/auth-service";
//import { SignIn, SignUp, ResetPassword } from "./components";
import {SignIn} from "./components/signIn";
import { SignUp } from "./components/signUp";
import {ResetPassword} from "./components/ResetPassword";
import { Tips } from "./pages/Tips";
import { Footer } from "./components/footer";
import type { User } from "./types/user";
import './index.css'
import { Routes,Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Premium } from "./pages/Premium";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { PrivateRoute } from "./services/Private";
import { NotFound } from "./pages/NotFound";
import { LiveScore } from "./pages/Livescore";

type ModalType = "signin" | "signup" | "reset" | null;

export default function App() {
  const { user, loading } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  //const [sessionTime, setSessionTime] = useState<string>("0s");

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
  // setSessionTime("0s");
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

  if (loading) return <div>Loading...</div>;

  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/premium" element={<Premium/>} />
          <Route path="/livescore" element={<LiveScore/>} />
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
      <Navbar
        currentUser={currentUser}
        isLoggedIn={!!currentUser}
        onLoginClick={() => setActiveModal("signin")}
        onSignUpClick={() => setActiveModal("signup")}
        onLogout={handleSignOut}
      />

      

      {/* Modals */}
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
        <Footer/>
    </>
  );
}
