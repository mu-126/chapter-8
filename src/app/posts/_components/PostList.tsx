"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Post } from "@/types/Post";

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts");
        const data = await res.json();
        setPosts(data.posts ?? []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, []);

  if (loading) {
    return <div className="max-w-3xl mx-auto my-16">読み込み中…</div>;
  }

  if (posts.length === 0) {
    return <div className="max-w-3xl mx-auto my-16">記事が見つかりませんでした</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          {post.title}
        </Link>
      ))}
    </div>
  );
};

export default PostList;
