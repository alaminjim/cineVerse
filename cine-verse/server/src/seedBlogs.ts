import { prisma } from "./app/lib/prisma.js";

const blogs = [
  {
    title: "The Evolution of IMAX: Beyond The Big Screen",
    excerpt: "How 70mm film continues to set the standard for cinematic immersion in a digital world.",
    content: "Full content of the IMAX article goes here... IMAX has revolutionized the way we experience cinema. From its humble beginnings as a specialized format for museums to becoming the gold standard for global blockbusters, 70mm IMAX film remains the ultimate expression of large-format cinematography.",
    category: "Cinematography",
    author: "Alex Rivera",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    tags: ["IMAX", "70mm", "Cinematography", "Nolan"],
    publishDate: new Date("2024-10-12"),
  },
  {
    title: "CineBuddy AI: Behind The Scenes of Our Movie Expert",
    excerpt: "Exploring the neural networks that help our AI understand the emotional depth of cinema.",
    content: "Full content of the AI article goes here... Our CineBuddy AI isn't just a search tool. It's a sophisticated neural network designed to understand the nuance of storytelling, character development, and genre blending.",
    category: "Technology",
    author: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    tags: ["AI", "Tech", "Streaming", "Future"],
    publishDate: new Date("2024-10-10"),
  },
  {
    title: "Hidden Gems: 5 Indie Thrillers You Missed This Year",
    excerpt: "Deep dives into the underground hits that are making waves in the world of independent film.",
    content: "Full content of the Indie Thrillers article goes here... While the blockbusters dominate the box office, these five independent thrillers have quietly carved out a niche for themselves with innovative storytelling and raw performances.",
    category: "Recommendations",
    author: "James Wilson",
    image: "https://images.unsplash.com/photo-1542204113-e9354e712f51?auto=format&fit=crop&q=80&w=800",
    tags: ["Indie", "Thriller", "ArtHouse"],
    publishDate: new Date("2024-10-08"),
  },
  {
    title: "The Art of the Long Take: Masterclasses in Flow",
    excerpt: "A look at the most technically demanding tracking shots in modern cinematic history.",
    content: "Full content of the Long Take article goes here... The long take is a feat of engineering and choreography. We analyze the most famous one-shot sequences and what they add to the narrative flow of a film.",
    category: "Directing",
    author: "Marcus Thorne",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800",
    tags: ["Directing", "Cinematography", "OneShot"],
    publishDate: new Date("2024-10-05"),
  },
];

async function main() {
  console.log("Seeding blogs...");
  const db = prisma as any;
  for (const blog of blogs) {
    await db.blog.create({
      data: blog,
    });
  }
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
