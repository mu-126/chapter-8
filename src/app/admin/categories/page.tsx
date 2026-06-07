"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/categories");

        if (!res.ok) {
          throw new Error("取得失敗");
        }

        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error(error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, []);

  if (loading) {
    return <div className="p-8">読み込み中…</div>;
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">カテゴリー一覧</h2>

        <Link href="/admin/categories/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          新規作成
        </Link>
      </div>

      {/* 一覧 */}
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="py-4 border-b border-gray-300">
            <Link href={`/admin/categories/${category.id}`}>
              <span className="font-semibold hover:underline">{category.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
