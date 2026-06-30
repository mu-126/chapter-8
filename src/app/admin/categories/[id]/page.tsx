"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { AdminCategoryShowResponse } from "@/_types/Category";
import CategoryForm from "@/components/CategoryForm";

const CategoryDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  // 削除
  const handleDelete = async () => {
    if (!confirm("削除しますか？")) return;

    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <p className="p-4">読み込み中...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">カテゴリー編集</h1>

      <CategoryForm name={name} setName={setName} onSubmit={handleUpdate} onDelete={handleDelete} isLoading={isLoading} />
    </div>
  );
};

export default CategoryDetailPage;
