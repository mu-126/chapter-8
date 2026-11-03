"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "@/app/_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const NewCategoryPage = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleCreate = async () => {
    if (!token) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 👈 Header に token を付与
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("作成失敗");
      }

      alert("カテゴリー作成成功！");
      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      alert("エラー");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* タイトル */}
      <h1 className="text-2xl font-bold mb-6">カテゴリー作成</h1>

      {/* フォーム */}
      <CategoryForm name={name} setName={setName} onSubmit={handleCreate} isLoading={isLoading} />
    </div>
  );
};

export default NewCategoryPage;
