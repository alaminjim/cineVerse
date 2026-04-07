"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { userService } from "@/services/user.service";
import { 
  Settings, 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Save,
  Loader2,
  Camera
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function UserSettingsPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userService.updateUserProfile(formData);
      if (res.success) {
        setUser(res.data);
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pt-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
           <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/20">
              <Settings className="w-8 h-8 text-blue-400" />
           </div>
           <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">Your <span className="text-blue-500">Settings.</span></h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Manage your account and preferences</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
           
           {/* Navigation Sidebar */}
           <div className="md:col-span-4 space-y-2">
              {[
                { label: "Profile Information", icon: User, active: true },
                { label: "Account Security", icon: Shield, active: false },
                { label: "Notifications", icon: Bell, active: false },
                { label: "Privacy Details", icon: Lock, active: false }
              ].map((tab, i) => (
                <button 
                  key={i}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                    tab.active 
                      ? "bg-white/10 text-white shadow-xl shadow-white/5 border border-white/10" 
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  }`}
                >
                   <tab.icon className="w-4 h-4" />
                   {tab.label}
                </button>
              ))}
           </div>

           {/* Settings Form */}
           <div className="md:col-span-8">
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-gray-900/40 border border-gray-800/50 rounded-[2.5rem] p-10 backdrop-blur-xl space-y-8"
              >
                 {/* Avatar Upload Placeholder */}
                 <div className="flex items-center gap-8 pb-8 border-b border-gray-800/50">
                    <div className="relative group">
                       <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-1">
                          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center font-black text-2xl border-4 border-gray-900 overflow-hidden">
                             {formData.image ? (
                               <img src={formData.image} className="w-full h-full object-cover" />
                             ) : formData.name?.[0].toUpperCase()}
                          </div>
                       </div>
                       <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-all">
                          <Camera className="w-4 h-4" />
                       </button>
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-lg">Your Avatar</h3>
                       <p className="text-gray-500 text-xs font-medium">JPG, GIF or PNG. Max size of 2MB.</p>
                    </div>
                 </div>

                 {/* Inputs */}
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="John Doe"
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700" 
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                       <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="john@example.com"
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700" 
                          />
                       </div>
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={loading}
                   className="w-full py-4 bg-white text-black font-black uppercase italic tracking-widest text-xs rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Save Changes
                      </>
                    )}
                 </button>
              </motion.form>
           </div>

        </div>
      </div>
    </div>
  );
}
