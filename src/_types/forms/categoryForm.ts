export type CategoryFormProps = {
  name: string;
  setName: (value: string) => void;
  onSubmit: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
};
