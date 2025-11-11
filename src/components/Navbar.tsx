import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { User } from "../types/user";

interface NavbarProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onLogout: () => void;
  currentUser?: User | null;
}

const navLinks = [
  { name: "Home", path: "/", admin: false },
  { name: "Basic Tips", path: "/basic", admin: false },
  { name: "Premium", path: "/premium", admin: false },
  { name: "Live Score", path: "/livescore", admin: false },
  { name: "Admin", path: "/admin", admin: true },
];

export const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  onLoginClick,
  onSignUpClick,
  onLogout,
  currentUser,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileButtonRef.current &&
        !profileButtonRef.current.contains(e.target as Node) &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-close mobile menu on outside click
const toggleButtonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(e.target as Node) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  return (
    <nav
      className={`w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg fixed top-0 left-0  transition-all duration-300 ${
        scrolled ? "py-2 backdrop-blur-md bg-opacity-95" : "py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* ===== LEFT SECTION (Logo) ===== */}
          <NavLink
            to="/"
            className="flex items-center space-x-3 group transition-transform hover:scale-105"
          >
            <div className="h-10 w-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center text-slate-900 font-bold text-xl shadow-lg group-hover:shadow-yellow-400/50 transition-all">
              P
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Predict
            </span>
          </NavLink>

          {/* ===== CENTER (Desktop Links) ===== */}
          <div className="hidden md:block">
            <ul className="flex items-center space-x-1">
              {navLinks
                .filter((link) => !link.admin || currentUser?.isAdmin)
                .map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-yellow-400/10 text-yellow-400 font-semibold shadow-inner"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>

          {/* ===== RIGHT SECTION (Desktop Auth/Profile) ===== */}
          <div className="hidden md:flex items-end space-x-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-5 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={onSignUpClick}
                  className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-yellow-400/50 hover:scale-105"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-slate-900 font-bold shadow-lg group-hover:shadow-yellow-400/50 transition-all overflow-hidden">
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "U"
                  )}
                </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* ===== Profile Dropdown ===== */}
                {showProfileMenu && (
                  <div
                    ref={profileMenuRef}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-4">
                      <p className="font-bold text-slate-900 text-lg">
                        {currentUser?.email}
                      </p>
                      <p className="text-sm text-slate-700 truncate">
                        {currentUser?.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <NavLink
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xl">👤</span>
                        <span className="font-medium">View Profile</span>
                      </NavLink>
                      <NavLink
                        to="/profile/edit"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xl">✏️</span>
                        <span className="font-medium">Edit Profile</span>
                      </NavLink>
                      <NavLink
                        to="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xl">⚙️</span>
                        <span className="font-medium">Settings</span>
                      </NavLink>
                      <NavLink
                        to="/notifications"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xl">🔔</span>
                        <span className="font-medium">Notifications</span>
                      </NavLink>
                    </div>

                    <div className="border-t border-gray-200" />

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                        navigate("/");
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span className="text-xl">🚪</span>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ===== MOBILE TOGGLE ===== */}
          <button
            ref={toggleButtonRef}
            className="md:hidden text-yellow-400 focus:outline-none p-2 hover:bg-white/5 rounded-lg transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden top-10 bg-slate-900 border-t border-slate-700 shadow-xl animate-in slide-in-from-top  duration-200"
        >
          <ul className="flex flex-col py-4 space-y-1 px-4">
            {navLinks
              .filter((link) => !link.admin || currentUser?.isAdmin)
              .map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-yellow-400/10 text-yellow-400 font-semibold"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}

            {!isLoggedIn ? (
              <>
                <li className="pt-2">
                  <button
                    onClick={() => {
                      onLoginClick();
                      setIsOpen(false);
                    }}
                    className="w-full text-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    Sign In
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onSignUpClick();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 rounded-lg font-semibold shadow-lg transition-all hover:from-yellow-500 hover:to-amber-600"
                  >
                    Sign Up
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="pt-2 border-t border-slate-700 mt-2">
                  <div className="px-4 py-3 text-sm text-gray-400">
                    {currentUser?.email || "user@example.com"}
                  </div>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <span>👤</span>
                    <span>Profile</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};