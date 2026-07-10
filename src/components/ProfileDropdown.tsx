import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User as UserIcon, Pencil, Settings, Bell, KeyRound, LogOut } from "lucide-react";
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
  const profileMenuRef = React.useRef<HTMLDivElement>(null);
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
    { to: "/profile", icon: UserIcon, label: "View Profile" },
    { to: "/profile/edit", icon: Pencil, label: "Edit Profile" },
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
  ];

  return (
    <>
      {showProfileMenu && (
        <div
          ref={profileMenuRef}
          className="fixed z-50 w-64 bg-surface-raised rounded-card shadow-card-hover border border-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            top: profileButtonRef.current
              ? profileButtonRef.current.getBoundingClientRect().bottom + 8
              : "auto",
            right: "16px",
          }}
        >
          {/* User header */}
          <div className="bg-surface-muted border-b border-border px-4 py-4">
            <p className="font-bold text-text-primary text-lg leading-tight">
              {currentUser?.name ?? "Account"}
            </p>
            <p className="text-sm text-text-secondary truncate">{currentUser?.email}</p>
          </div>

          {/* Nav links */}
          <div className="py-2">
            {menuItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 min-h-11 px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
              >
                <Icon size={18} className="w-6 shrink-0" aria-hidden="true" />
                <span className="font-medium text-sm">{label}</span>
              </NavLink>
            ))}

            {/* API Key — opens modal */}
            <button
              onClick={() => {
                setShowProfileMenu(false);
                setShowApiKeyModal(true);
              }}
              className="flex items-center gap-3 w-full min-h-11 px-4 py-3 text-text-secondary hover:text-info hover:bg-info-bg transition-colors group"
            >
              <KeyRound size={18} className="w-6 shrink-0" aria-hidden="true" />
              <span className="font-medium text-sm">API Key</span>
              <span className="ml-auto text-xs text-info font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                Manage →
              </span>
            </button>
          </div>

          <div className="border-t border-border" />

          {/* Logout */}
          <button
            onClick={() => {
              setShowProfileMenu(false);
              onLogout();
              navigate("/");
            }}
            className="flex items-center gap-3 w-full min-h-11 px-4 py-3 text-danger hover:bg-danger-bg transition-colors"
          >
            <LogOut size={18} className="w-6 shrink-0" aria-hidden="true" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal onClose={() => setShowApiKeyModal(false)} />
      )}
    </>
  );
};