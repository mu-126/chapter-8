"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "@/components/CategoryForm";

const NewCategoryPage = () => {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    }
  };

  return (
    <div>
      {/* タイトル */}
      <h1 className="text-2xl font-bold mb-6">カテゴリー作成</h1>

      {/* フォーム */}
      <CategoryForm name={name} setName={setName} onSubmit={handleCreate} />
    </div>
  );
};

export default NewCategoryPage;
