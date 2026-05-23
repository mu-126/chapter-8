"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { AdminPostDetailResponse } from "@/app/api/admin/posts/[id]/route";
import Image from "next/image";
import Link from "next/link";

const AdminPostDetailPage = () => {
  const params = useParams();
  const id = params.id;

  const [post, setPost] = useState<AdminPostDetailResponse["post"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/admin/posts/${id}`);

        if (!res.ok) {
          throw new Error("取得失敗");
        }

        const data: AdminPostDetailResponse = await res.json();
        setPost(data.post);
      } catch (error) {
        console.error(error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetcher();
  }, [id]);

  if (loading) {
    return <div className="p-8">読み込み中…</div>;
  }

  if (!post) {
    return <div className="p-8">記事が見つかりません</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      {/* タイトル */}
      <h1 className="text-2xl font-bold">{post.title}</h1>

      {/* サムネ */}
      {post.thumbnailUrl && <Image src={post.thumbnailUrl} alt="" width={400} height={250} />}

      {/* 日付 */}
      <p className="text-sm text-gray-500">作成日：{new Date(post.createdAt).toLocaleDateString("ja-JP")}</p>

      {/* カテゴリ */}
      <div className="flex gap-2 flex-wrap">
        {post.postCategories.map((pc) => (
          <span key={pc.category.id} className="text-xs border px-2 py-1 rounded">
            {pc.category.name}
          </span>
        ))}
      </div>

      {/* 本文 */}
      <div className="whitespace-pre-wrap border-t pt-4">{post.content}</div>

      {/* ボタン */}
      <div className="flex gap-4 pt-4">
        <Link href={`/admin/posts/${post.id}/edit`} className="px-4 py-2 bg-blue-500 text-white rounded">
          編集
        </Link>

        <Link href="/admin/posts" className="px-4 py-2 border rounded">
          一覧に戻る
        </Link>
      </div>
    </div>
  );
};

export default AdminPostDetailPage;
