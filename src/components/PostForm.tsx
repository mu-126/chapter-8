"use client";

import { PostFormProps } from "@/_types/postForm";

const PostForm = ({ title, content, thumbnailUrl, categoryId, categories, onChangeTitle, onChangeContent, onChangeThumbnailUrl, onChangeCategoryId, onSubmit, submitLabel, onDelete }: PostFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label>タイトル</label>
        <input className="w-full border p-2 rounded" value={title} onChange={(e) => onChangeTitle(e.target.value)} />
      </div>

      <div>
        <label>内容</label>
        <textarea className="w-full border p-2 rounded" rows={6} value={content} onChange={(e) => onChangeContent(e.target.value)} />
      </div>

      <div>
        <label>サムネイルURL</label>
        <input className="w-full border p-2 rounded" value={thumbnailUrl} onChange={(e) => onChangeThumbnailUrl(e.target.value)} />
      </div>

      <div>
        <label>カテゴリー</label>
        <select className="w-full border p-2 rounded" value={categoryId} onChange={(e) => onChangeCategoryId(e.target.value)}>
          <option value="">選択してください</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded">
          {submitLabel}
        </button>

        {onDelete && (
          <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded">
            削除
          </button>
        )}
      </div>
    </div>
  );
};

export default PostForm;
