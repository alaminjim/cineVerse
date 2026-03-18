import { PricingType } from "../../../generated/prisma/enums";

export interface ICreateMovie {
  title: string;
  synopsis: string;
  thumbnail?: string;
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  streamingPlatform: string[];
  pricing: PricingType;
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
}
