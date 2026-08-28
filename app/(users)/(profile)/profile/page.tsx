"use client";

import { useEffect, useState } from "react";
import { User, Heart, Settings, LogOut, Menu, X } from "lucide-react";

import PersonalInformation from "@/components/profile/personal-information";
import Preferences from "@/components/profile/preferences";
import ProfileSettings from "@/components/profile/settings";

type Tab = "profile" | "preferences" | "settings";

interface UserData {
  name: string;
  email: string;
  image?: string;
  phone?: string;

  location?: {
    country?: string;
    state?: string;
    city?: string;
  };

  address?: {
    addressLine?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  dateOfBirth?: string;
  gender?: string;

  preferences?: {
    newsletter?: boolean;
    marketingEmails?: boolean;
    orderUpdates?: boolean;
    favoriteCategories?: string[];
  };
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState<UserData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/profile", {
        method: "GET",
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("Invalid profile response:", response.status, text);

        return;
      }

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to load profile:", response.status, data.message);

        if (response.status === 401) {
          window.location.href = "/login";
        }

        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();

      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    window.location.href = "/login";
  };

  const menuItems = [
    {
      id: "profile" as Tab,
      label: "Personal Information",
      icon: User,
    },
    {
      id: "preferences" as Tab,
      label: "Preferences",
      icon: Heart,
    },
    {
      id: "settings" as Tab,
      label: "Settings",
      icon: Settings,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Mobile Header */}

      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-neutral-950 px-4 py-4 lg:hidden">
        <h1 className="text-lg font-semibold">My Profile</h1>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg border border-white/10 p-2"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}

        <aside
          className={`
            fixed inset-y-0 left-0 z-50
            flex w-72 flex-col
            border-r border-white/10
            bg-neutral-900
            p-5
            transition-transform duration-300
            lg:sticky lg:top-0 lg:h-screen
            lg:translate-x-0

            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Profile */}

          <div className="mb-10 flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-neutral-700">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold">{user?.name}</p>

              <p className="truncate text-sm text-neutral-400">{user?.email}</p>
            </div>
          </div>

          {/* Navigation */}

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    flex w-full items-center gap-3
                    rounded-xl px-4 py-3
                    text-left transition

                    ${
                      isActive
                        ? "bg-white text-black"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon size={20} />

                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}

          <div className="mt-auto border-t border-white/10 pt-5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>

        {/* Overlay */}

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}

        {/* Content */}

        <section className="min-h-screen flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-5xl">
            {activeTab === "profile" && (
              <PersonalInformation user={user} setUser={setUser} />
            )}

            {activeTab === "preferences" && (
              <Preferences user={user} setUser={setUser} />
            )}

            {activeTab === "settings" && <ProfileSettings />}
          </div>
        </section>
      </div>
    </div>
  );
}
