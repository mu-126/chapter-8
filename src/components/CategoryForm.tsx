type Props = {
  name: string;
  setName: (value: string) => void;
  onSubmit: () => void;
  onDelete?: () => void;
};

const CategoryForm = ({ name, setName, onSubmit, onDelete, isLoading }: Props) => {
  return (
    <div className="max-w-2xl">
      {/* ラベル */}
      <label className="block mb-2 font-medium">カテゴリー名</label>

      {/* 入力欄 */}
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} className="w-full border border-gray-300 rounded px-3 py-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed" />

      {/* ボタン */}
      <div className="flex gap-3">
        <button onClick={onSubmit} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed">
          保存
        </button>

        {/* 削除はあるときだけ表示 */}
        {onDelete && (
          <button onClick={onDelete} disabled={isLoading} className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed">
            削除
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryForm;
