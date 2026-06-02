export interface ICreateReview {
  movieId: string;
  rating: number;
  title: string;
  content: string;
  tags?: string[];
  hasSpoiler?: boolean;
}

export interface IUpdateReview {
  movieId: string;
  rating?: number;
  title?: string;
  content?: string;
  tags?: string[];
  hasSpoiler?: boolean;
}
