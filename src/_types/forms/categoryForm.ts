export type CategoryFormProps = {
  name: string;
  setName: (value: string) => void;
  onSubmit: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
};

export type CategoryOption = {
  id: number;
  name: string;
};
