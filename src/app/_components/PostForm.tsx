"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { PostFormProps } from "@/_types/postForm";
import { Input } from "@/app/_components/Input";
import { supabase } from "@/app/_libs/supabase";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ

const PostForm = ({ title, content, thumbnailImageKey, categoryId, categories, onChangeTitle, onChangeContent, onChangeThumbnailImageKey, onChangeCategoryId, onSubmit, submitLabel, onDelete, isLoading }: PostFormProps) => {
  // 画像表示用URLを管理するstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null);

  // 画像を選択したときの処理
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) {
      // 画像が選択されていないのでreturn
      return;
    }

    const file = event.target.files[0]; // 選択された画像を取得

    const filePath = `private/${uuidv4()}`; // Supabaseに保存するファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail") // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    onChangeThumbnailImageKey(data.path);
  };

  useEffect(() => {
    if (!thumbnailImageKey) return;

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage.from("post_thumbnail").getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  return (
    <div className="space-y-4">
      <div>
        <label>タイトル</label>
        <Input value={title} onChange={onChangeTitle} disabled={isLoading} />
      </div>

      <div>
        <label>内容</label>
        <textarea className="w-full border p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" rows={6} value={content} onChange={(e) => onChangeContent(e.target.value)} disabled={isLoading} />
      </div>

      <div>
        <label htmlFor="thumbnailImageKey">サムネイルURL</label>
        <input type="file" id="thumbnailImageKey" onChange={handleImageChange} accept="image/*" disabled={isLoading} />
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image src={thumbnailImageUrl} alt="thumbnail" width={400} height={400} unoptimized />
          </div>
        )}
      </div>

      <div>
        <label>カテゴリー</label>
        <select className="w-full border p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed" value={categoryId} onChange={(e) => onChangeCategoryId(e.target.value)} disabled={isLoading}>
          <option value="">選択してください</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onSubmit} disabled={isLoading} className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed">
          {submitLabel}
        </button>

        {onDelete && (
          <button onClick={onDelete} disabled={isLoading} className="bg-red-500 text-white px-4 py-2 rounded">
            削除
          </button>
        )}
      </div>
    </div>
  );
};

export default PostForm;
