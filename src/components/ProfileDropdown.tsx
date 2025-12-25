import React, { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { User } from "../types/user";

interface ProfileDropdownProps {
  currentUser?: User | null;
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  onLogout: () => void;
  profileButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  currentUser,
  showProfileMenu,
  setShowProfileMenu,
  onLogout,
  profileButtonRef,
}) => {
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);

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
  }, [profileButtonRef, setShowProfileMenu]);

  if (!showProfileMenu) return null;

  return (
    <div
      ref={profileMenuRef}
      className="fixed z-50 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        top: profileButtonRef.current
          ? profileButtonRef.current.getBoundingClientRect().bottom + 8
          : "auto",
        right: "16px",
      }}
    >
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-4">
        <p className="font-bold text-slate-900 text-lg">
          {currentUser?.email}
        </p>
        <p className="text-sm text-slate-700 truncate">{currentUser?.email}</p>
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
  );
};