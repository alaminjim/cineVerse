/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "@tanstack/react-form";
import { moviesService } from "@/services/movies.service";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Save, Upload } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function EditMoviePage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      synopsis: "",
      genre: "",
      language: "",
      releaseYear: new Date().getFullYear(),
      director: "",
      cast: "",
      streamingPlatform: "",
      type: "MOVIE",
      pricing: "FREE",
      seasons: "",
      episodes: "",
      runtime: "",
      streamingLink: "",
      buyPrice: "",
      rentPrice: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        
        if (file) {
          formData.append("file", file);
        }

        const data: any = {
          title: value.title,
          synopsis: value.synopsis,
          director: value.director,
          releaseYear: Number(value.releaseYear),
          type: value.type,
          pricing: value.pricing,
          genre: value.genre.split(",").map((s: string) => s.trim()).filter(Boolean),
          language: value.language.split(",").map((s: string) => s.trim()).filter(Boolean),
          cast: value.cast.split(",").map((s: string) => s.trim()).filter(Boolean),
          streamingPlatform: value.streamingPlatform.split(",").map((s: string) => s.trim()).filter(Boolean),
        };

        if (value.seasons) data.seasons = Number(value.seasons);
        if (value.episodes) data.episodes = Number(value.episodes);
        if (value.runtime) data.runtime = Number(value.runtime);
        if (value.streamingLink) data.streamingLink = value.streamingLink;

        if (value.pricing === "PREMIUM") {
          if (value.buyPrice) data.buyPrice = Number(value.buyPrice);
          if (value.rentPrice) data.rentPrice = Number(value.rentPrice);
        }

        formData.append("data", JSON.stringify(data));

        await moviesService.updateMovie(movieId, formData);
        toast.success("Movie updated successfully!");
        router.push("/admin/movies");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to update movie");
      }
    },
  });

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await moviesService.getMovieById(movieId);
        const data = res?.data;
        if (data) {
          form.setFieldValue("title", data.title || "");
          form.setFieldValue("synopsis", data.synopsis || "");
          form.setFieldValue("genre", data.genre?.join(", ") || "");
          form.setFieldValue("language", data.language?.join(", ") || "");
          form.setFieldValue("releaseYear", data.releaseYear || new Date().getFullYear());
          form.setFieldValue("director", data.director || "");
          form.setFieldValue("cast", data.cast?.join(", ") || "");
          form.setFieldValue("streamingPlatform", data.streamingPlatform?.join(", ") || "");
          form.setFieldValue("type", data.type || "MOVIE");
          form.setFieldValue("pricing", data.pricing || "FREE");
          form.setFieldValue("seasons", data.seasons || "");
          form.setFieldValue("episodes", data.episodes || "");
          form.setFieldValue("runtime", data.runtime || "");
          form.setFieldValue("streamingLink", data.streamingLink || "");
          form.setFieldValue("buyPrice", data.buyPrice || "");
          form.setFieldValue("rentPrice", data.rentPrice || "");
          setPreview(data.thumbnail || null);
        }
      } catch (error) {
        toast.error("Failed to fetch movie details");
      } finally {
        setLoading(false);
      }
    };
    if (movieId) fetchMovie();
  }, [movieId, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );

  return (
    <div className="text-white max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/movies"
          className="p-2 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-all text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Edit Movie
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Update the metadata of this movie or series
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Thumbnail Section */}
          <div className="md:col-span-1">
            <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                Thumbnail
              </h3>
              <label className="block w-full aspect-[2/3] border-2 border-dashed border-gray-700/50 rounded-xl overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all group relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-purple-400 transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold uppercase tracking-widest">Upload Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Change Image</span>
                </div>
              </label>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                Basic Info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <form.Field name="title">
                  {(field) => (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Title *</label>
                      <input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                        placeholder="e.g. Inception"
                        required
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="type">
                  {(field) => (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Type *</label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value as any)}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all appearance-none"
                      >
                        <option value="MOVIE">Movie</option>
                        <option value="SERIES">Series</option>
                      </select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="releaseYear">
                  {(field) => (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Release Year *</label>
                      <input
                        type="number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                        required
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="genre">
                  {(field) => (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Genre(s) *</label>
                      <input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                        placeholder="Action, Sci-Fi"
                        required
                      />
                      <span className="text-[10px] text-gray-600">Comma separated</span>
                    </div>
                  )}
                </form.Field>

                <form.Field name="language">
                  {(field) => (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Language(s) *</label>
                      <input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                        placeholder="English, Spanish, Hindi"
                        required
                      />
                      <span className="text-[10px] text-gray-600">Comma separated</span>
                    </div>
                  )}
                </form.Field>

                <form.Field name="director">
                  {(field) => (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Director *</label>
                      <input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                        required
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="synopsis">
                  {(field) => (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Synopsis *</label>
                      <textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all min-h-[100px]"
                        required
                      />
                    </div>
                  )}
                </form.Field>
                
                <form.Field name="cast">
                  {(field) => (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Cast *</label>
                      <input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                        placeholder="Actor 1, Actor 2"
                        required
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                Media & Pricing
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <form.Field name="streamingPlatform">
                  {(field) => (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Streaming Platforms *</label>
                      <input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                        placeholder="Netflix, Amazon Prime"
                        required
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="streamingLink">
                  {(field) => (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Streaming URL</label>
                      <input
                        type="url"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                        placeholder="https://"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="runtime">
                  {(field) => (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Runtime (mins)</label>
                      <input
                        type="number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Subscribe
                  selector={(state) => state.values.type}
                  children={(type) => (
                    type === "SERIES" ? (
                      <>
                        <form.Field name="seasons">
                          {(field) => (
                            <div>
                              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Seasons</label>
                              <input
                                type="number"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                              />
                            </div>
                          )}
                        </form.Field>
                        <form.Field name="episodes">
                          {(field) => (
                            <div>
                              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Episodes</label>
                              <input
                                type="number"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                              />
                            </div>
                          )}
                        </form.Field>
                      </>
                    ) : null
                  )}
                />

                <form.Field name="pricing">
                  {(field) => (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Pricing Model *</label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value as any)}
                        className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all appearance-none"
                      >
                        <option value="FREE">Free (Subscription Based)</option>
                        <option value="PREMIUM">Premium (Buy/Rent)</option>
                      </select>
                    </div>
                  )}
                </form.Field>

                <form.Subscribe
                  selector={(state) => state.values.pricing}
                  children={(pricing) => (
                    pricing === "PREMIUM" ? (
                      <>
                        <form.Field name="buyPrice">
                          {(field) => (
                            <div>
                              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Buy Price (৳)</label>
                              <input
                                type="number"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                                required
                              />
                            </div>
                          )}
                        </form.Field>
                        <form.Field name="rentPrice">
                          {(field) => (
                            <div>
                              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Rent Price (৳)</label>
                              <input
                                type="number"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
                                required
                              />
                            </div>
                          )}
                        </form.Field>
                      </>
                    ) : null
                  )}
                />
              </div>
            </div>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save Changes
                </button>
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
