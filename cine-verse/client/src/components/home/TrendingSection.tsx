"use client";

import MovieCard from "../movie/MovieCard";

const trendingMovies = [
  { id: 5, title: "Deadpool & Wolverine", year: "2024", rating: 8.2, image: "https://images.unsplash.com/photo-1613918431703-625164dccbf8?q=80&w=800&auto=format&fit=crop" },
  { id: 6, title: "Kingdom of the Planet of the Apes", year: "2024", rating: 7.3, image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop" },
  { id: 7, title: "Furiosa: A Mad Max Saga", year: "2024", rating: 7.9, image: "https://images.unsplash.com/photo-1503551723145-6c040742065b-v2?q=80&w=800&auto=format&fit=crop" },
  { id: 8, title: "Inside Out 2", year: "2024", rating: 8.0, image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=800&auto=format&fit=crop" },
  { id: 9, title: "Godzilla x Kong", year: "2024", rating: 6.5, image: "https://images.unsplash.com/photo-1533923156502-be31530547c4?q=80&w=800&auto=format&fit=crop" },
  { id: 10, title: "Civil War", year: "2024", rating: 7.6, image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop" },
];

export default function TrendingSection() {
  return (
    <section className="py-20 bg-gray-950 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Trending <span className="gradient-text">Now</span></h2>
            <p className="text-gray-400">What everyone is watching this week.</p>
          </div>
          <button className="text-purple-400 hover:text-purple-300 font-semibold text-sm hidden sm:block">
            Explore More
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingMovies.map((movie, index) => (
            <MovieCard 
              key={movie.id}
              title={movie.title}
              image={movie.image}
              rating={movie.rating}
              year={movie.year}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
