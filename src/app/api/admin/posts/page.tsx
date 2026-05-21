"use client";

import { useEffect, useState } from "react";
import type { AdminPostsIndexResponse } from "@/app/api/admin/posts/route";
import Image from "next/image";
import Link from "next/link";

const AdminPostsPage = () => {
  const [posts, setPosts] = useState<AdminPostsIndexResponse["posts"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/posts");

        if (!res.ok) {
          throw new Error("取得失敗");
        }

        const data: AdminPostsIndexResponse = await res.json();

        setPosts(data.posts);
      } catch (error) {
        console.error(error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, []);

  if (loading) {
    return <div className="p-8">読み込み中…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">記事一覧（管理）</h1>

      {posts.length === 0 ? (
        <p>記事がありません</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="border p-4 rounded">
              <Link href={`/posts/${post.id}`}>
                <h2 className="text-lg font-semibold hover:underline">{post.title}</h2>
              </Link>

              {/* サムネイル */}
              {post.thumbnailUrl && <Image src={post.thumbnailUrl} alt="" width={200} height={120} />}

              {/* 日付 */}
              <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString("ja-JP")}</p>

              {/* カテゴリ */}
              <div className="flex gap-2 flex-wrap mt-2">
                {post.postCategories.map((pc) => (
                  <span key={pc.category.id} className="text-xs border px-2 py-1 rounded">
                    {pc.category.name}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPostsPage;
