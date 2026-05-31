"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

export default function CategoryDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`);

        if (!res.ok) {
          throw new Error("データ取得失敗");
        }

        const data = await res.json();
        setCategory(data.category);
      } catch (err) {
        setError("エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  // ローディング
  if (loading) {
    return <p className="p-4">読み込み中...</p>;
  }

  // エラー
  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  // データなし
  if (!category) {
    return <p className="p-4">カテゴリーが見つかりません</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">カテゴリー詳細</h1>

      <div className="border p-4 rounded">
        <p>
          <span className="font-bold">ID:</span> {category.id}
        </p>
        <p>
          <span className="font-bold">名前:</span> {category.name}
        </p>
      </div>

      {/* 編集ボタン */}
      <a href={`/admin/categories/${category.id}/edit`} className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        編集する
      </a>
    </div>
  );
}
