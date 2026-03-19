export interface IAddWatchlistResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    userId: string;
    movieId: string;
    addedAt: Date;
  };
}

export interface IWatchlistMovie {
  id: string;
  userId: string;
  movieId: string;
  movie: {
    id: string;
    title: string;
    synopsis: string;
    thumbnail?: string;
    genre: string[];
    releaseYear: number;
    director: string;
    avgRating: number;
  };
  addedAt: Date;
}
