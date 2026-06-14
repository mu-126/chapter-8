"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

const PostEditPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // 記事データ取得
  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/admin/posts/${id}`);
      const data = await res.json();

      const post = data.post;

      setTitle(post.title);
      setContent(post.content);
      setThumbnailUrl(post.thumbnailUrl);
      setCategoryId(post.postCategories[0]?.category.id.toString() || "");
    };

    const fetchCategories = async () => {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories);
    };

    fetchPost();
    fetchCategories();
  }, [id]);

  // 更新
  const handleUpdate = async () => {
    console.log("更新クリック");

    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl,
        categoryIds: categoryId ? [Number(categoryId)] : [],
      }),
    });

    if (!res.ok) {
      alert("更新失敗");
      return;
    }

    alert("更新成功");
    router.push("/admin/posts");
  };

  // 削除
  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;

    await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
    });

    alert("削除しました");
    router.push("/admin/posts");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">記事編集</h1>

      <div className="space-y-4">
        <div>
          <label>タイトル</label>
          <input className="w-full border p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label>内容</label>
          <textarea className="w-full border p-2 rounded" rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        <div>
          <label>サムネイルURL</label>
          <input className="w-full border p-2 rounded" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
        </div>

        <div>
          <label>カテゴリー</label>
          <select className="w-full border p-2 rounded" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">選択してください</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={handleUpdate} className="bg-indigo-600 text-white px-4 py-2 rounded">
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

export default PostEditPage;
