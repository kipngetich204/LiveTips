import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ChevronDown, User as UserIcon, Settings, LogOut } from "lucide-react";
import type { User } from "../types/user";
import { Logo } from "../assets/logo";
import { ProfileDropdown } from "./ProfileDropdown";

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
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close mobile menu on outside click
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
      className={`w-full bg-surface text-text-primary border-b border-border fixed top-0 left-0 z-40 transition-all duration-300 ${
        scrolled ? "py-2 backdrop-blur-md bg-surface/95" : "py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* ===== LEFT SECTION (Logo) ===== */}
          <NavLink
            to="/"
            className="flex items-center space-x-3 transition-opacity hover:opacity-80"
          >
            <Logo variant="navbar" logoText="LT" />
            <span className="font-bold text-xl text-text-primary">
              LIVE TIPS
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
                        `px-4 py-2 rounded-control transition-colors duration-200 ${
                          isActive
                            ? "bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black font-semibold"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
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
                  className="min-h-11 px-5 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={onSignUpClick}
                  className="min-h-11 px-5 py-2 bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black rounded-control hover:opacity-90 transition-opacity duration-200 font-semibold"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-3 py-2 min-h-11 rounded-control hover:bg-surface-muted transition-colors duration-200"
                >
                  <div className="w-9 h-9 rounded-full bg-surface-muted border border-border flex items-center justify-center text-text-primary font-bold overflow-hidden">
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
                  <ChevronDown
                    size={16}
                    className={`text-text-secondary transition-transform duration-200 ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* ===== Profile Dropdown Component ===== */}
                <ProfileDropdown
                  currentUser={currentUser}
                  showProfileMenu={showProfileMenu}
                  setShowProfileMenu={setShowProfileMenu}
                  onLogout={onLogout}
                  profileButtonRef={profileButtonRef}
                />
              </div>
            )}
          </div>

          {/* ===== MOBILE TOGGLE ===== */}
          <button
            ref={toggleButtonRef}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden min-h-11 min-w-11 flex items-center justify-center text-text-primary hover:bg-surface-muted rounded-control transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden top-10 bg-surface border-t border-border shadow-card-hover animate-in slide-in-from-top duration-200"
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
                      `block min-h-11 flex items-center px-4 py-3 rounded-control transition-colors ${
                        isActive
                          ? "bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black font-semibold"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
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
                    className="w-full min-h-11 text-center px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-control transition-colors"
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
                    className="w-full min-h-11 px-4 py-3 bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black rounded-control font-semibold transition-opacity hover:opacity-90"
                  >
                    Sign Up
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="pt-2 border-t border-border mt-2">
                  <div className="px-4 py-3 text-sm text-text-secondary">
                    {currentUser?.email || "user@example.com"}
                  </div>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 min-h-11 px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-control transition-colors"
                  >
                    <UserIcon size={16} aria-hidden="true" />
                    <span>Profile</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 min-h-11 px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-surface-muted rounded-control transition-colors"
                  >
                    <Settings size={16} aria-hidden="true" />
                    <span>Settings</span>
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 w-full min-h-11 text-left px-4 py-3 text-danger hover:bg-danger-bg rounded-control transition-colors"
                  >
                    <LogOut size={16} aria-hidden="true" />
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