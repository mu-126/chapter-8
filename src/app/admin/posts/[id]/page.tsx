"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostForm from "@/components/PostForm";
import { AdminCategoriesIndexResponse, CategoryOption } from "@/_types/Category";
import { AdminPostDetailResponse } from "@/_types/Post";

const PostEditPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  // 記事データ取得
  useEffect(() => {
    const fetchData = async () => {
      // 記事
      const postRes = await fetch(`/api/admin/posts/${id}`);
      const postData: AdminPostDetailResponse = await postRes.json();

      const post = postData.post;

      if (!post) {
        alert("記事が見つかりません");
        router.push("/admin/posts");
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setThumbnailUrl(post.thumbnailUrl);
      setCategoryId(post.postCategories[0]?.category.id.toString() || "");

      // カテゴリー
      const catRes = await fetch("/api/admin/categories");
      const catData: AdminCategoriesIndexResponse = await catRes.json();

      const options = catData.categories.map((c: CategoryResponse) => ({
        id: c.id,
        name: c.name,
      }));

      setCategories(options);
    };

    fetchData();
  }, [id, router]);

  // 更新
  const handleUpdate = async () => {
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
      const err = await res.json();
      alert(err.message);
      return;
    }

    alert("更新成功");
    router.push("/admin/posts");
  };

  // 削除
  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;

    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message);
      return;
    }

    alert("削除しました");
    router.push("/admin/posts");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">記事編集</h1>

      <PostForm title={title} content={content} thumbnailUrl={thumbnailUrl} categoryId={categoryId} categories={categories} onChangeTitle={setTitle} onChangeContent={setContent} onChangeThumbnailUrl={setThumbnailUrl} onChangeCategoryId={setCategoryId} onSubmit={handleUpdate} onDelete={handleDelete} submitLabel="更新" />
    </div>
  );
};

export default PostEditPage;
