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
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const limit = 10;

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await moviesService.getAllMovies({ 
        page, 
        limit, 
        searchTerm 
      });
      setMovies(res?.data || []);
      setTotalPages(res?.meta?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, searchTerm]);

  const confirmDelete = (id: string) => {
    setSelectedMovieId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedMovieId) return;
    try {
      setDeleteLoading(selectedMovieId);
      await moviesService.deleteMovie(selectedMovieId);
      toast.success("Movie deleted successfully");
      setMovies((prev) => prev.filter((m) => m.id !== selectedMovieId));
      setDeleteModalOpen(false);
      setSelectedMovieId(null);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Manage Movies
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create, update, and delete movies in the database
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="relative group w-full sm:w-64"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Loader2 className={`w-4 h-4 text-gray-500 transition-colors group-focus-within:text-purple-500 ${loading ? "animate-spin" : ""}`} />
            </div>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full bg-gray-900/40 border border-gray-800/50 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder:text-gray-600"
            />
          </form>

          <Link
            href="/admin/movies/create"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-wider text-[10px] hover:opacity-90 transition-all shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Movie
          </Link>
        </div>
      </div>

      {/* Mobile Card View (Tablet & below) */}
      <div className="lg:hidden space-y-4">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700/50 transition-all">
              <div className="flex gap-4">
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-xl shrink-0 border border-gray-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight mb-1">{movie.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{movie.genre?.join(", ")}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shrink-0 ${
                      movie.type === "SERIES" ? "bg-blue-600/15 text-blue-400 border border-blue-500/10" : "bg-purple-600/15 text-purple-400 border border-purple-500/10"
                    }`}>
                      {movie.type}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded-lg border border-gray-700/50">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-yellow-500 font-bold text-xs">{movie.avgRating?.toFixed(1) || "0.0"}</span>
                    </div>
                    <span className="text-gray-400 text-xs font-medium">
                      Release: {movie.releaseYear}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 pt-5 border-t border-gray-800/50 grid grid-cols-2 gap-3">
                <Link
                  href={`/admin/movies/edit/${movie.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 border border-gray-700 hover:border-blue-500/30 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </Link>
                <button
                  onClick={() => confirmDelete(movie.id)}
                  disabled={deleteLoading === movie.id}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-red-600/20 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500/30 rounded-xl transition-all text-xs font-black uppercase tracking-widest disabled:opacity-50"
                >
                  {deleteLoading === movie.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-10 text-center text-gray-500 italic">
            No movies found.
          </div>
        )}
      </div>

      {/* Desktop Table View (lg & above) */}
      <div className="hidden lg:block bg-gray-900/40 border border-gray-800/50 rounded-2xl overflow-hidden">
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
                          onClick={() => confirmDelete(movie.id)}
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

      {/* Pagination Controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-800/50">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Showing Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-6 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-xs font-black uppercase tracking-widest hover:border-purple-500/50 transition-all disabled:opacity-30"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="px-6 py-2.5 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <Trash2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">Delete Movie</h3>
                <p className="text-sm text-gray-400 font-medium">Are you sure you want to delete this movie? This action cannot be undone.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedMovieId(null);
                }}
                disabled={!!deleteLoading}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-wider text-xs bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all border border-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!!deleteLoading}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-wider text-xs bg-red-600 text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
