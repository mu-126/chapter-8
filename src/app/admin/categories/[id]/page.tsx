"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

  // 取得
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await fetch(`/api/admin/categories/${id}`);
      const data = await res.json();
      setName(data.category.name);
      setLoading(false);
    };

    if (id) fetchCategory();
  }, [id]);

  // 更新
  const handleUpdate = async () => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      alert("更新しました");
    } else {
      alert("更新失敗");
    }
  };

  // 削除
  const handleDelete = async () => {
    if (!confirm("削除しますか？")) return;

    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("削除しました");
      router.push("/admin/categories");
    } else {
      alert("削除失敗");
    }
  };

  if (loading) return <p className="p-4">読み込み中...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">カテゴリー編集</h1>

      <div className="max-w-2xl">
        {/* ラベル */}
        <label className="block mb-2 font-medium">カテゴリー名</label>

        {/* 入力欄 */}
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mb-4" />

        {/* ボタン */}
        <div className="flex gap-3">
          <button onClick={handleUpdate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            更新
          </button>

          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
