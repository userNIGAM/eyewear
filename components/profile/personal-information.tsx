"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";

import { Camera, Save } from "lucide-react";

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

interface Props {
  user: UserData | null;

  setUser: Dispatch<SetStateAction<UserData | null>>;
}

export default function PersonalInformation({ user, setUser }: Props) {
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  if (!user) return null;

  const updateField = (field: keyof UserData, value: unknown) => {
    setUser({
      ...user,
      [field]: value,
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      updateField("image", reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch("/api/user/profile", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data.user);

      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Personal Information</h1>

        <p className="mt-2 text-sm text-neutral-400">
          Manage your personal details and delivery information.
        </p>
      </div>

      {/* Profile Image */}

      <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5 sm:p-6">
        <h2 className="mb-5 text-lg font-semibold">Profile Picture</h2>

        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-neutral-800">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-neutral-200">
            <Camera size={18} />
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Basic Information */}

      <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5 sm:p-6">
        <h2 className="mb-6 text-lg font-semibold">Basic Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Name"
            value={user.name}
            onChange={(value) => updateField("name", value)}
          />

          <Input label="Email Address" value={user.email} disabled />

          <Input
            label="Phone Number"
            value={user.phone || ""}
            onChange={(value) => updateField("phone", value)}
          />

          <Input
            label="Date of Birth"
            type="date"
            value={
              user.dateOfBirth ? user.dateOfBirth.toString().split("T")[0] : ""
            }
            onChange={(value) => updateField("dateOfBirth", value)}
          />

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Gender</label>

            <select
              value={user.gender || ""}
              onChange={(event) => updateField("gender", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 outline-none focus:border-white/30"
            >
              <option value="">Select gender</option>

              <option value="male">Male</option>

              <option value="female">Female</option>

              <option value="other">Other</option>

              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location */}

      <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5 sm:p-6">
        <h2 className="mb-6 text-lg font-semibold">Location</h2>

        <div className="grid gap-5 md:grid-cols-3">
          <Input
            label="Country"
            value={user.location?.country || ""}
            onChange={(value) =>
              updateField("location", {
                ...user.location,
                country: value,
              })
            }
          />

          <Input
            label="State / Province"
            value={user.location?.state || ""}
            onChange={(value) =>
              updateField("location", {
                ...user.location,
                state: value,
              })
            }
          />

          <Input
            label="City"
            value={user.location?.city || ""}
            onChange={(value) =>
              updateField("location", {
                ...user.location,
                city: value,
              })
            }
          />
        </div>
      </div>

      {/* Delivery Address */}

      <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5 sm:p-6">
        <h2 className="mb-6 text-lg font-semibold">Delivery Address</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Address"
              value={user.address?.addressLine || ""}
              onChange={(value) =>
                updateField("address", {
                  ...user.address,
                  addressLine: value,
                })
              }
            />
          </div>

          <Input
            label="City"
            value={user.address?.city || ""}
            onChange={(value) =>
              updateField("address", {
                ...user.address,
                city: value,
              })
            }
          />

          <Input
            label="State / Province"
            value={user.address?.state || ""}
            onChange={(value) =>
              updateField("address", {
                ...user.address,
                state: value,
              })
            }
          />

          <Input
            label="Postal Code"
            value={user.address?.postalCode || ""}
            onChange={(value) =>
              updateField("address", {
                ...user.address,
                postalCode: value,
              })
            }
          />

          <Input
            label="Country"
            value={user.address?.country || ""}
            onChange={(value) =>
              updateField("address", {
                ...user.address,
                country: value,
              })
            }
          />
        </div>
      </div>

      {/* Save */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          <Save size={18} />

          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className="text-sm text-neutral-400">{message}</p>}
      </div>
    </form>
  );
}

interface InputProps {
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;

  onChange?: (value: string) => void;
}

function Input({
  label,
  value,
  type = "text",
  disabled,
  onChange,
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-neutral-400">{label}</label>

      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
