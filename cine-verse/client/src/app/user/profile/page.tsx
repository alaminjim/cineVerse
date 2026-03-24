/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/lib/store";
import {
  Loader2,
  UserCircle,
  Mail,
  Calendar,
  Save,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { setUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getUserProfile();
        if (res?.data) {
          setProfile(res.data);
          setForm({
            name: res.data.name || "",
            email: res.data.email || "",
          });
        }
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await userService.updateUserProfile(form);
      if (res?.data) {
        setProfile(res.data);
        setUser(res.data);
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );

  return (
    <div className="text-white max-w-2xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Profile Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-500/20">
            {profile?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile?.name}</h2>
            <p className="text-gray-500 text-sm">{profile?.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                <Shield className="w-3 h-3" /> {profile?.role}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-400">
                ● {profile?.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          Member since {new Date(profile?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-8 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
          Edit Profile
        </h3>

        <div>
          <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <UserCircle className="w-4 h-4" /> Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
            required
          />
        </div>

        <div>
          <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
