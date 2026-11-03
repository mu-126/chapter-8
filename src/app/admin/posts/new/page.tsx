"use client";

import { useState, useEffect } from "react";
import PostForm from "@/app/_components/PostForm";
import { Category } from "@/_types/Category";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const NewPostPage = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useSupabaseSession();

  // カテゴリー取得
  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // 👈 Header に token を付与
          },
        });

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
  }, [token]);

  // 作成
  const handleCreate = async () => {
    if (!token) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          title,
          content,
          thumbnailUrl,
          categoryIds: categoryId ? [Number(categoryId)] : [],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }

      alert("作成成功！");
      router.push("/admin/posts");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">記事作成</h1>

      <PostForm title={title} content={content} thumbnailUrl={thumbnailUrl} categoryId={categoryId} categories={categories} onChangeTitle={setTitle} onChangeContent={setContent} onChangeThumbnailUrl={setThumbnailUrl} onChangeCategoryId={setCategoryId} onSubmit={handleCreate} submitLabel="作成" isLoading={isLoading} />
    </div>
  );
};

export default NewPostPage;
