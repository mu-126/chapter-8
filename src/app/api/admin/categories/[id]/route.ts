import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";

// レスポンスの型
export type AdminCategoryShowResponse = {
  category: {
    id: number;
    name: string;
  };
};

// GET /api/admin/categories/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const categoryId = Number(params.id);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        postCategories: {
          include: {
            post: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ message: "カテゴリーが見つかりません" }, { status: 404 });
    }

    return NextResponse.json<AdminCategoryShowResponse>({
      category,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
}
