"use client";

import { useState, useEffect } from "react";

type Category = {
  id: number;
  name: string;
};

const NewPostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // カテゴリー取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");

        if (!res.ok) {
          throw new Error("取得失敗");
        }

        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error(error);
        alert("カテゴリー取得エラー");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl,
        categoryIds: [Number(categoryId)],
      }),
    });

    if (res.ok) {
      alert("作成成功！");
    } else {
      alert("エラー");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">記事作成</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* タイトル */}
        <div>
          <label className="block mb-1 text-sm">タイトル</label>
          <input className="w-full border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* 内容 */}
        <div>
          <label className="block mb-1 text-sm">内容</label>
          <textarea className="w-full border rounded px-3 py-2 h-40" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        {/* サムネ */}
        <div>
          <label className="block mb-1 text-sm">サムネイルURL</label>
          <input className="w-full border rounded px-3 py-2" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://placehold.jp/800×400.png" />
        </div>

        {/* カテゴリー */}
        <div>
          <label className="block mb-1 text-sm">カテゴリー</label>
          {loading ? (
            <p>読み込み中...</p>
          ) : (
            <select className="w-full border rounded px-3 py-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">選択してください</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ボタン */}
        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded">
          作成
        </button>
      </form>
    </div>
  );
};

export default NewPostPage;
