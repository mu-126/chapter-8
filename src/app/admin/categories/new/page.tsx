"use client";

import { useState } from "react";

export default function NewCategoryPage() {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      alert("カテゴリー作成成功！");
      setName(""); // 入力リセット
    } else {
      alert("エラー");
    }
  };

  return (
    <div>
      {/* タイトル */}
      <h1 className="text-2xl font-bold mb-6">カテゴリー作成</h1>

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* カテゴリー名 */}
        <div>
          <label className="block mb-1 text-sm">カテゴリー名</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* ボタン */}
        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded">
          作成
        </button>
      </form>
    </div>
  );
}
