export interface ILikeResponse {
  success: boolean;
  message: string;
  likesCount: number;
}

export interface IIsLikedResponse {
  success: boolean;
  isLiked: boolean;
}
