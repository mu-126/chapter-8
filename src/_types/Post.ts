export type Post = {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
  postCategories: {
    category: {
      id: number;
      name: string;
    };
  }[];
};

export type AdminPostDetailResponse = {
  post: {
    id: number;
    title: string;
    content: string;
    thumbnailUrl: string;
    createdAt: string;
    updatedAt: string;
    postCategories: {
      category: {
        id: number;
        name: string;
      };
    }[];
  } | null;
};

export type DeleteResponse = {
  message: string;
};

export type ErrorResponse = {
  message: string;
};
