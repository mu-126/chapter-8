const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* サイドバー */}
        <aside className="w-64 bg-gray-200 min-h-screen p-4 space-y-4">
          <p className="font-semibold">記事一覧</p>
          <p className="text-gray-600">カテゴリー一覧</p>
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
