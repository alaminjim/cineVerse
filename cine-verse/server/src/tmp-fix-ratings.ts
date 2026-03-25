import { prisma } from "./app/lib/prisma.js";

async function main() {
  console.log("Finalizing review approvals and rating updates...");

  try {
    const updateReviews = await prisma.review.updateMany({
      where: { status: "PENDING" },
      data: { status: "APPROVED" },
    });
    console.log(`Updated ${updateReviews.count} reviews to APPROVED.`);

    const movies = await prisma.movie.findMany({
      select: { id: true },
    });

    for (const movie of movies) {
      const reviews = await prisma.review.findMany({
        where: {
          movieId: movie.id,
          status: "APPROVED",
        },
        select: { rating: true },
      });

      if (reviews.length > 0) {
        const avgRating =
          reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length;
        
        await prisma.movie.update({
          where: { id: movie.id },
          data: {
            avgRating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length,
          },
        });
        console.log(
          `Updated Movie ${movie.id}: Avg ${avgRating.toFixed(1)} (${reviews.length} reviews)`,
        );
      } else {
        await prisma.movie.update({
          where: { id: movie.id },
          data: {
            avgRating: 0,
            reviewCount: 0,
          },
        });
      }
    }

    console.log("All ratings synced!");
  } catch (error) {
    console.error("Error during sync:", error);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
