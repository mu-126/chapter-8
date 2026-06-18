// 共通の中身
type PostBase<TDate> = {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  createdAt: TDate;
  updatedAt: TDate;
  postCategories: {
    category: {
      id: number;
      name: string;
    };
  }[];
};

// Prisma（サーバー内部）用
export type Post = PostBase<Date>;

// APIレスポンス用
export type PostResponse = PostBase<string>;

// 詳細API
export type AdminPostDetailResponse = {
  post: PostResponse | null;
};

// 一覧API
export type AdminPostsIndexResponse = {
  posts: PostResponse[];
};

// 共通レスポンス
export type DeleteResponse = {
  message: string;
};

export type ErrorResponse = {
  message: string;
};
