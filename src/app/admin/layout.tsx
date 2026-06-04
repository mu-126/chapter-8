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
        <aside className="w-64 bg-gray-200 min-h-screen p-4 space-y-4">
          <Link href="/admin/posts" className={`block px-3 py-2 rounded ${isPost ? "bg-sky-300 font-semibold" : "text-gray-700"}`}>
            記事一覧
          </Link>

          <Link href="/admin/categories" className={`block px-3 py-2 rounded ${isCategory ? "bg-sky-300 font-semibold" : "text-gray-700"}`}>
            カテゴリー一覧
          </Link>
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
