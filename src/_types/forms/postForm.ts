import { Category } from "./Category";

export type PostFormProps = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categoryId: string;
  categories: Category[];

  onChangeTitle: (v: string) => void;
  onChangeContent: (v: string) => void;
  onChangeThumbnailImageKey: (v: string) => void;
  onChangeCategoryId: (v: string) => void;

  onSubmit: () => void;
  submitLabel: string;

  onDelete?: () => void;
  isLoading: boolean;
};
