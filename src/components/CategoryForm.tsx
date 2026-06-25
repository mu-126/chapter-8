type Props = {
  name: string;
  setName: (value: string) => void;
  onSubmit: () => void;
  onDelete?: () => void;
};

const CategoryForm = ({ name, setName, onSubmit, onDelete }: Props) => {
  return (
    <div className="max-w-2xl">
      {/* ラベル */}
      <label className="block mb-2 font-medium">カテゴリー名</label>

      {/* 入力欄 */}
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mb-4" />

      {/* ボタン */}
      <div className="flex gap-3">
        <button onClick={onSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
          保存
        </button>

        {/* 削除はあるときだけ表示 */}
        {onDelete && (
          <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded">
            削除
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryForm;
