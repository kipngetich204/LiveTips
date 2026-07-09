import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { User } from "../types/user";
import { ApiKeyModal } from "../settings/ApiKeyPage";
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
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

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



  const menuItems = [
    { to: "/profile",       icon: "👤", label: "View Profile"   },
    { to: "/profile/edit",  icon: "✏️", label: "Edit Profile"   },
    { to: "/settings",      icon: "⚙️", label: "Settings"       },
    { to: "/notifications", icon: "🔔", label: "Notifications"  },
  ];

  return (
    <>


          
      {showProfileMenu && (   // ← dropdown is conditionally shown
      <div ref={profileMenuRef} className="fixed z-50 ...">
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
        {/* User header */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-4">
          <p className="font-bold text-slate-900 text-lg leading-tight">
            {currentUser?.name ?? "Account"}
          </p>
          <p className="text-sm text-slate-700 truncate">{currentUser?.email}</p>
        </div>

        {/* Nav links */}
        <div className="py-2">
          {menuItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setShowProfileMenu(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl w-6 text-center">{icon}</span>
              <span className="font-medium text-sm">{label}</span>
            </NavLink>
          ))}

          {/* API Key — opens modal */}
          <button
            onClick={() => {
              setShowProfileMenu(false);
              setShowApiKeyModal(true);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-colors group"
          >
            <span className="text-xl w-6 text-center">🔑</span>
            <span className="font-medium text-sm group-hover:text-indigo-600 transition-colors">
              API Key
            </span>
            <span className="ml-auto text-xs text-indigo-400 font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
              Manage →
            </span>
          </button>
        </div>

        <div className="border-t border-gray-100" />

        {/* Logout */}
        <button
          onClick={() => {
            setShowProfileMenu(false);
            onLogout();
            navigate("/");
          }}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 transition-colors"
        >
          <span className="text-xl w-6 text-center">🚪</span>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
      </div>
    )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal onClose={() => setShowApiKeyModal(false)} />
      )}
    </>
  );
};