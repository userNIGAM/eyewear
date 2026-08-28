"use client";

import { Dispatch, SetStateAction } from "react";
import { Save } from "lucide-react";

interface UserData {
  name: string;
  email: string;

  preferences?: {
    newsletter?: boolean;
    marketingEmails?: boolean;
    orderUpdates?: boolean;
    favoriteCategories?: string[];
  };
}

interface Props {
  user: UserData | null;

  setUser: Dispatch<SetStateAction<any>>;
}

export default function Preferences({ user, setUser }: Props) {
  if (!user) return null;

  const preferences = {
    newsletter: user.preferences?.newsletter || false,

    marketingEmails: user.preferences?.marketingEmails || false,

    orderUpdates: user.preferences?.orderUpdates ?? true,

    favoriteCategories: user.preferences?.favoriteCategories || [],
  };

  const updatePreference = (key: string, value: boolean) => {
    setUser({
      ...user,

      preferences: {
        ...preferences,
        [key]: value,
      },
    });
  };

  const savePreferences = async () => {
    try {
      await fetch("/api/user/profile", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          preferences: user.preferences,
        }),
      });

      alert("Preferences updated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const options = [
    {
      key: "newsletter",
      title: "Newsletter",
      description: "Receive updates about new eyewear collections.",
    },

    {
      key: "marketingEmails",
      title: "Marketing Emails",
      description: "Receive offers, promotions and discounts.",
    },

    {
      key: "orderUpdates",
      title: "Order Updates",
      description: "Receive important updates about your orders.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Preferences</h1>

        <p className="mt-2 text-neutral-400">
          Customize your account experience.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-neutral-900">
        {options.map((option, index) => (
          <div
            key={option.key}
            className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${
              index !== options.length - 1 ? "border-b border-white/10" : ""
            }`}
          >
            <div>
              <h3 className="font-medium">{option.title}</h3>

              <p className="mt-1 text-sm text-neutral-400">
                {option.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                updatePreference(
                  option.key,
                  !preferences[option.key as keyof typeof preferences],
                )
              }
              className={`
                relative h-7 w-12 rounded-full transition

                ${
                  preferences[option.key as keyof typeof preferences]
                    ? "bg-white"
                    : "bg-neutral-700"
                }
              `}
            >
              <span
                className={`
                  absolute top-1 h-5 w-5 rounded-full transition

                  ${
                    preferences[option.key as keyof typeof preferences]
                      ? "left-6 bg-black"
                      : "left-1 bg-white"
                  }
                `}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={savePreferences}
        className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black"
      >
        <Save size={18} />
        Save Preferences
      </button>
    </div>
  );
}
