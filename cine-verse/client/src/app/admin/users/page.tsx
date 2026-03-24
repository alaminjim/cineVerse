/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { adminService } from "@/services/admin.service";
import { Loader2, Trash2, Shield, ShieldAlert, CheckCircle, Ban } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers(1, 100);
      setUsers(res?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      setActionLoading(`status-${userId}`);
      await adminService.updateUserStatus(userId, status);
      toast.success(`User marked as ${status}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u))
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      setActionLoading(`delete-${userId}`);
      await adminService.deleteUser(userId);
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          User Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor and manage user accounts and access
        </p>
      </div>

      <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 border-b border-gray-800/50 text-gray-400 font-bold uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex flex-shrink-0 items-center justify-center shadow-lg">
                          <span className="font-black text-white">{user.name?.[0]?.toUpperCase() || "U"}</span>
                        </div>
                        <div>
                          <p className="font-bold text-white max-w-[150px] truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 max-w-[200px] truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg w-max ${
                        user.role === "ADMIN" ? "bg-purple-600/15 text-purple-400" : "bg-gray-800 text-gray-400"
                      }`}>
                        {user.role === "ADMIN" ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        disabled={actionLoading === `status-${user.id}` || user.role === "ADMIN"}
                        style={{ backgroundColor: "#111827" }}
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md cursor-pointer outline-none border text-center w-[100px] focus:ring-1 focus:ring-purple-500 disabled:opacity-50 transition-all ${
                          user.status === "ACTIVE"
                            ? "text-green-400 border-green-500/40"
                            : user.status === "BANNED"
                            ? "text-red-400 border-red-500/40"
                            : "text-yellow-400 border-yellow-500/40"
                        }`}
                      >
                        <option value="ACTIVE" className="bg-gray-900 text-green-400">Active</option>
                        <option value="SUSPENDED" className="bg-gray-900 text-yellow-400">Suspended</option>
                        <option value="BANNED" className="bg-gray-900 text-red-400">Banned</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={actionLoading === `delete-${user.id}` || user.role === "ADMIN"}
                          title="Delete User"
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-20 opacity-0 group-hover:opacity-100"
                        >
                          {actionLoading === `delete-${user.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
