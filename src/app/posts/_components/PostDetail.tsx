"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import type { Post } from "@/_types/Post";
// import { MicroCmsPost } from "@/app/_types/MicroCmsPost";
import type { PostShowResponse } from "@/app/api/posts/[id]/route";
import Image from "next/image";

const PostDetail = () => {
  const params = useParams();
  const id = params.id as string;

  // const [post, setPost] = useState<Post | null>(null);
  const [post, setPost] = useState<PostShowResponse["post"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/posts/${id}`);

        if (!res.ok) {
          throw new Error("データ取得に失敗しました");
        }

        const data: PostShowResponse = await res.json();

        // console.log(data);

        setPost(data.post); // dataをそのままセット← ここがシンプルに変わる
      } catch (error) {
        setPost(null); // 見つからなかった
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [id]);

  // まだ読み込み中
  if (loading) {
    return <div className="max-w-3xl max-auto my-16">読み込み中…</div>;
  }

  // 読み込みは終わったが、記事が存在しない
  if (!post) {
    return <div>記事が見つかりませんでした</div>;
  }

  return (
    <div className="max-w-3xl mx-auto my-16 space-y-10">
      <div key={post.id}>
        <div>{post.thumbnailUrl && <Image src={post.thumbnailUrl} alt="" width={800} height={400} unoptimized />}</div>
        <div className="p-4">
          <div className="flex justify-between text-sm  text-gray-500 mb-1">
            <span>{new Date(post.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" })}</span>
            <div className="flex gap-2 flex-wrap pr-4">
              {post.postCategories.map((pc) => (
                <span key={pc.category.id} className="bg-white text-blue-700 border border-blue-700 px-2 py-0.5 rounded text-sm">
                  {pc.category.name}
                </span>
              ))}
            </div>
          </div>
          <h1 className="text-2xl pb-6 text-gray-700">APIで取得した{post.title}</h1>

          {/* HTMLとして描画 */}
          <dd className="text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
