"use client";

import { useState, useEffect } from "react";
import PostForm from "@/components/PostForm";
import { Category } from "@/_types/Category";

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

  // 作成
  const handleCreate = async () => {
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl,
        categoryIds: categoryId ? [Number(categoryId)] : [],
      }),
    });

    if (res.ok) {
      alert("作成成功！");
    } else {
      alert("エラー");
    }
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">記事作成</h1>

      <PostForm title={title} content={content} thumbnailUrl={thumbnailUrl} categoryId={categoryId} categories={categories} onChangeTitle={setTitle} onChangeContent={setContent} onChangeThumbnailUrl={setThumbnailUrl} onChangeCategoryId={setCategoryId} onSubmit={handleCreate} submitLabel="作成" />
    </div>
  );
};

export default NewPostPage;
