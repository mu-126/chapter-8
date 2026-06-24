"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { AdminCategoryShowResponse } from "@/_types/Category";

const CategoryDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // 取得
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`);

        if (!res.ok) {
          throw new Error("取得失敗");
        }

        const data: AdminCategoryShowResponse = await res.json();

        setName(data.category.name);
      } catch (error) {
        console.error(error);
        alert("取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  // 更新
  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("更新失敗");
      }

      alert("更新しました");
      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました");
    }
  };

  // 削除
  const handleDelete = async () => {
    if (!confirm("削除しますか？")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("削除失敗");
      }

      alert("削除しました");
      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました");
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
};

export default CategoryDetailPage;
