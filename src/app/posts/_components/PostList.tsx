"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import type { Post } from "@/_types/Post";
import { MicroCmsPost } from "@/app/_types/MicroCmsPost";

const PostList = () => {
  // const [posts, setPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("https://h5w4frie2i.microcms.io/api/v1/posts", {
        // 管理画面で取得したエンドポイントを入力してください。
        headers: {
          // fetch関数の第二引数にheadersを設定でき、その中にAPIキーを設定します。
          "X-MICROCMS-API-KEY": process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string, // 管理画面で取得したAPIキーを入力してください。
        },
      });
      const { contents } = await res.json();
      setPosts(contents);

      setLoading(false);
      console.log(process.env.NEXT_PUBLIC_MICROCMS_API_KEY);
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
      <dl className="max-w-3xl mx-auto my-16 space-y-10">
        {posts.map((elem) => (
          <Link key={elem.id} href={`/posts/${elem.id}`} className="block border border-zinc-300 p-4  shadow-sm text-sm">
            <dt>
              <div className="flex justify-between text-sm  text-zinc-500 mb-1">
                <span>{new Date(elem.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" })}</span>
                <div className="flex gap-2 flex-wrap pr-32">
                  {elem.categories?.map((cat) => (
                    <span key={cat.id} className="bg-white   text-blue-700 border border-blue-700 px-2 py-0.5  rounded text-sm">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
              <h1 className="text-2xl pb-6 text-zinc-700">APIで取得した{elem.title}</h1>
            </dt>

            {/* HTMLとして描画 */}
            <dd className="text-zinc-700 line-clamp-2" dangerouslySetInnerHTML={{ __html: elem.content }} />
          </Link>
        ))}
      </dl>
    </div>
  );
};

export default PostList;
