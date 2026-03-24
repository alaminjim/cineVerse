/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { moviesService } from "@/services/movies.service";
import Link from "next/link";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      const res = await moviesService.getAllMovies({ limit: 100 });
      setMovies(res?.data || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      setDeleteLoading(id);
      await moviesService.deleteMovie(id);
      toast.success("Movie deleted successfully");
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete movie");
    } finally {
      setDeleteLoading(null);
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
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Manage Movies
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create, update, and delete movies in the database
          </p>
        </div>

        <Link
          href="/admin/movies/create"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Movie
        </Link>
      </div>

      <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 border-b border-gray-800/50 text-gray-400 font-bold uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Release Year</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={movie.thumbnail}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-bold text-white">{movie.title}</p>
                          <p className="text-xs text-gray-500 max-w-[200px] truncate">{movie.genre?.join(", ")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${
                        movie.type === "SERIES" ? "bg-blue-600/15 text-blue-400" : "bg-purple-600/15 text-purple-400"
                      }`}>
                        {movie.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-300">
                      {movie.releaseYear}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2 py-1 rounded-lg w-max">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-yellow-500 font-bold text-xs">{movie.avgRating?.toFixed(1) || "0.0"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/movies/edit/${movie.id}`}
                          className="p-2 text-gray-400 hover:text-blue-400 bg-gray-800/50 hover:bg-blue-500/10 rounded-lg transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          disabled={deleteLoading === movie.id}
                          className="p-2 text-gray-400 hover:text-red-400 bg-gray-800/50 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                        >
                          {deleteLoading === movie.id ? (
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
                    No movies found. Click "Add Movie" to create one.
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
