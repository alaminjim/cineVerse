import { MoviePricing, MovieStatus, MovieType } from "@prisma/client";

export interface ICreateMovie {
  title: string;
  synopsis: string;
  thumbnail?: string;
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  streamingPlatform: string[];

  type: ContentType;

  seasons?: number;
  episodes?: number;
  runtime?: number;

  streamingLink?: string;

  pricing: PricingType;
  buyPrice?: number;
  rentPrice?: number;
}

export interface IUpdateMovie {
  title?: string;
  synopsis?: string;
  thumbnail?: string;
  genre?: string[];
  releaseYear?: number;
  director?: string;
  cast?: string[];
  streamingPlatform?: string[];

  type?: ContentType;
  seasons?: number;
  episodes?: number;
  runtime?: number;
  streamingLink?: string;

  pricing?: PricingType;
}

export interface IFeaturedMovie {
  id: string;
  title: string;
  synopsis: string;
  thumbnail?: string;
  avgRating: number;
  reviewCount: number;
  genre: string[];
  releaseYear: number;
  director: string;
  type?: ContentType;
}
