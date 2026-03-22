"use client";

import MovieCard from "../movie/MovieCard";

const featuredMovies = [
  { id: 1, title: "Dune: Part Two", year: "2024", rating: 8.8, image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop" },
  { id: 2, title: "Oppenheimer", year: "2023", rating: 8.4, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "Spider-Man: Across the Spider-Verse", year: "2023", rating: 8.7, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop" },
  { id: 4, title: "The Dark Knight", year: "2008", rating: 9.0, image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop" },
];

export default function FeaturedSection() {
  return (
    <section className="py-20 relative px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured <span className="gradient-text">Movies</span></h2>
          <p className="text-gray-400">Handpicked masterpieces just for you.</p>
        </div>
        <button className="text-purple-400 hover:text-purple-300 font-semibold text-sm hidden sm:block">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredMovies.map((movie, index) => (
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
    </section>
  );
}
