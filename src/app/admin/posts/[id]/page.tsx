"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostForm from "@/app/_components/PostForm";
import { AdminCategoriesIndexResponse, CategoryResponse } from "@/_types/Category";
import { CategoryOption } from "@/_types/forms/categoryForm";
import { AdminPostDetailResponse } from "@/_types/Post";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const PostEditPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSupabaseSession();

  // 記事データ取得
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      // 記事
      const postRes = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 👈 Header に token を付与
        },
      });
      const postData: AdminPostDetailResponse = await postRes.json();

      const post = postData.post;

      if (!post) {
        alert("記事が見つかりません");
        router.push("/admin/posts");
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setThumbnailImageKey(post.thumbnailImageKey);
      setCategoryId(post.postCategories[0]?.category.id.toString() || "");

      // カテゴリー
      const catRes = await fetch("/api/admin/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const catData: AdminCategoriesIndexResponse = await catRes.json();

      const options = catData.categories.map((c: CategoryResponse) => ({
        id: c.id,
        name: c.name,
      }));

      setCategories(options);
    };

    fetchData();
  }, [id, router, token]);

  // 更新
  const handleUpdate = async () => {
    if (!token) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          title,
          content,
          thumbnailImageKey,
          categoryIds: categoryId ? [Number(categoryId)] : [],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }

      alert("更新成功");
      router.push("/admin/posts");
    } finally {
      setIsLoading(false);
    }
  };

  // 削除
  const handleDelete = async () => {
    if (!token) return;
    if (!confirm("本当に削除しますか？")) return;

    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }

      alert("削除しました");
      router.push("/admin/posts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">記事編集</h1>

      <PostForm
        title={title}
        content={content}
        thumbnailImageKey={thumbnailImageKey}
        categoryId={categoryId}
        categories={categories}
        onChangeTitle={setTitle}
        onChangeContent={setContent}
        onChangeThumbnailImageKey={setThumbnailImageKey}
        onChangeCategoryId={setCategoryId}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        submitLabel="更新"
        isLoading={isLoading}
      />
    </div>
  );
};

export default PostEditPage;
