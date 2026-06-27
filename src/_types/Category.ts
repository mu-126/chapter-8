// 共通
type CategoryBase<TDate> = {
  id: number;
  name: string;
  createdAt: TDate;
  updatedAt: TDate;
};

// Prisma用（サーバー内部）
export type Category = CategoryBase<Date>;

// API用（フロント）
export type CategoryResponse = CategoryBase<string>;

// 一覧API
export type AdminCategoriesIndexResponse = {
  categories: CategoryResponse[];
};

// POST用
export type AdminCategoryCreateResponse = {
  category: CategoryResponse;
};

// 詳細API
export type AdminCategoryShowResponse = {
  category: {
    id: number;
    name: string;
    posts: {
      post: {
        id: number;
        title: string;
        content: string;
        thumbnailUrl: string;
        createdAt: string;
        updatedAt: string;
      };
    }[];
  };
};

// 共通レスポンス
export type DeleteResponse = {
  message: string;
};

export type ErrorResponse = {
  message: string;
};

// フォーム用（UI専用）
export type CategoryOption = {
  id: number;
  name: string;
};

// UI用（セレクトボックスなど）
export type CategoryOption = {
  id: number;
  name: string;
};
