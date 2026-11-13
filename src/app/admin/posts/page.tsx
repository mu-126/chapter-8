"use client";

import { useEffect, useState } from "react";
import type { AdminPostsIndexResponse } from "@/_types/Post";
import Image from "next/image";
import Link from "next/link";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const AdminPostsPage = () => {
  const [posts, setPosts] = useState<AdminPostsIndexResponse["posts"]>([]);
  const [loading, setLoading] = useState(true); // postsの状態管理
  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/posts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // 👈 Header に token を付与
          },
        }); // fetchでAPIにデータを取りに行く

        if (!res.ok) {
          throw new Error("取得失敗");
        }

        const { posts }: AdminPostsIndexResponse = await res.json(); // JSONに変換

        setPosts([...posts]); // 取得したデータを画面に入れる
      } catch (error) {
        console.error(error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [token]);

  if (loading) {
    return <div className="p-8">読み込み中…</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">記事一覧</h1>

        <Link href="/admin/posts/new" className="bg-indigo-500 text-white px-4 py-2 rounded">
          新規作成
        </Link>
      </div>

      <ul>
        {posts.map((post) => (
          <li key={post.id} className="py-4 border-b border-gray-300">
            <Link href={`/admin/posts/${post.id}`}>
              <h3 className="font-semibold hover:underline">{post.title}</h3>
            </Link>

            <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString("ja-JP")}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AdminPostsPage;
