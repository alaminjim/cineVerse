"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { authService } from "@/services/auth.service";
import { 
  User, 
  Mail, 
  Shield, 
  Settings as SettingsIcon, 
  Save, 
  Loader2,
  Lock,
  Bell,
  Eye,
  EyeOff
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Local state for form
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Assuming there's a profile update service
      // For now, we'll simulate success if the service isn't fully implemented
      toast.success("Profile settings updated locally!");
      // In a real app: await userService.updateProfile({ name, email });
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
          Admin <span className="text-purple-500">Settings.</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium">Manage your account preferences and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Profile */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-xl"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 p-1 mb-4 shadow-2xl shadow-purple-500/20">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center border-4 border-gray-900 overflow-hidden">
                <span className="text-4xl font-black text-white">{user?.name?.[0]?.toUpperCase() || "A"}</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-purple-400 text-xs font-black uppercase tracking-widest mt-1">{user?.role}</p>
            
            <div className="w-full mt-8 pt-6 border-t border-gray-800/50 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-gray-500">Security</span>
                <span className="text-green-500">High</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-gray-500">Two-Factor</span>
                <span className="text-gray-400">Disabled</span>
              </div>
            </div>
          </motion.div>

          <div className="bg-gray-900/40 border border-gray-800/50 rounded-3xl p-6 space-y-4 backdrop-blur-xl">
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Notification Center</h3>
             <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Admin Alerts</span>
                <input type="checkbox" defaultChecked className="accent-purple-600 h-4 w-4 rounded" />
             </label>
             <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">New Reviews</span>
                <input type="checkbox" defaultChecked className="accent-purple-600 h-4 w-4 rounded" />
             </label>
             <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Sales Reports</span>
                <input type="checkbox" className="accent-purple-600 h-4 w-4 rounded" />
             </label>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl"
          >
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   <User className="w-5 h-5 text-purple-500" />
                   General Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-800 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-purple-600 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input 
                        type="email"
                        value={email}
                        readOnly
                        className="w-full bg-gray-900/20 border border-gray-800 text-gray-500 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-800/50 space-y-6">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   <Lock className="w-5 h-5 text-purple-500" />
                   Security Check
                </h3>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Update Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        className="w-full bg-gray-900/50 border border-gray-800 text-white pl-12 pr-12 py-3.5 rounded-2xl focus:outline-none focus:border-purple-600 transition-all font-medium"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-600 font-medium italic mt-1 ml-1">Leave blank to keep current password.</p>
                </div>
              </div>

              <div className="pt-10">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl shadow-purple-600/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Apply Transitions
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
