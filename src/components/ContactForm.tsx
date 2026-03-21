"use client";

import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = {
  name: string;
  email: string;
  message: string;
};

const ContactForm = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 入力変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // バリデーション
  const validate = (): boolean => {
    const newErrors: FormErrors = {
      name: "",
      email: "",
      message: "",
    };

    if (!form.name) {
      newErrors.name = "お名前は必須です。";
    }

    if (!form.email) {
      newErrors.email = "メールアドレスは必須です。";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "メールアドレスの形式が正しくありません。";
      }
    }

    if (!form.message) {
      newErrors.message = "本文は必須です。";
    }

    setErrors(newErrors);

    // エラーが1つでもあれば false
    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  // クリアボタン
  const handleClear = () => {
    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  // 送信
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("送信失敗");
      }

      alert("送信しました");

      // フォームクリア
      handleClear();
    } catch (error) {
      alert("送信中にエラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h2 className="text-xl font-bold mb-10">問合わせフォーム</h2>

      <form onSubmit={handleSubmit}>
        {/* 名前 */}
        <div className="flex justify-between items-center mb-6">
          <label className="w-[240px] text-gray-700">お名前</label>
          <div className="w-full">
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-4 h-14" disabled={isSubmitting} />
            {errors.name && <p className="mt-2 text-sm text-red-700">{errors.name}</p>}
          </div>
        </div>

        {/* メールアドレス */}
        <div className="flex justify-between items-center mb-6">
          <label className="w-[240px] text-gray-700">メールアドレス</label>
          <div className="w-full">
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-4 h-14" disabled={isSubmitting} />
            {errors.email && <p className="mt-2 text-sm text-red-700">{errors.email}</p>}
          </div>
        </div>

        {/* 本文 */}
        <div className="flex justify-between items-center mb-6">
          <label className="w-[240px] text-gray-700">本文</label>
          <div className="w-full">
            <textarea name="message" value={form.message} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-4 h-[220px]" disabled={isSubmitting} />
            {errors.message && <p className="text-sm text-red-700">{errors.message}</p>}
          </div>
        </div>

        {/* ボタン */}
        <div className="flex justify-center gap-4">
          <button type="submit" className="px-4 py-2 bg-gray-800 text-white font-bold rounded-lg" disabled={isSubmitting}>
            送信
          </button>
          <button type="button" onClick={handleClear} className="px-4 py-2 bg-gray-200 font-bold rounded-lg" disabled={isSubmitting}>
            クリア
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
