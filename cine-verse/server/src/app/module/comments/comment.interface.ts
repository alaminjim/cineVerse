export interface ICreateComment {
  reviewId: string;
  content: string;
  parentCommentId?: string;
}

export interface IUpdateComment {
  content: string;
}
