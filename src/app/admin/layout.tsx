"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isCategory = pathname.startsWith("/admin/categories");
  const isPost = pathname.startsWith("/admin/posts");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* サイドバー */}
        <aside className="w-64 bg-gray-200 min-h-screen">
          <div className="p-4 space-y-2">
            <Link href="/admin/posts" className={`block w-full px-4 py-2 rounded ${isPost ? "bg-slate-200 text-gray-900 font-semibold" : "text-gray-700"}`}>
              記事一覧
            </Link>

            <Link href="/admin/categories" className={`block w-full px-4 py-2 rounded ${isCategory ? "bg-slate-200 text-gray-900 font-semibold" : "text-gray-700"}`}>
              カテゴリー一覧
            </Link>
          </div>
        </aside>

        {/* メイン */}
        <main className="flex-1 p-8">
          {children} {/* ここに page.tsx が入る */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
