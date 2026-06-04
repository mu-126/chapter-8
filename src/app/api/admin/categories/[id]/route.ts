import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";

// レスポンスの型
export type AdminCategoryShowResponse = {
  category: {
    id: number;
    name: string;
    posts: {
      post: {
        id: number;
        title: string;
        content: string;
        thumbnailUrl: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }[];
  };
};

// GET
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        posts: {
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
};

// PUT: カテゴリー更新
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // body取得
    const body = await req.json();
    const { name } = body;

    // バリデーション
    if (!name || name.trim() === "") {
      return NextResponse.json({ message: "カテゴリー名は必須です" }, { status: 400 });
    }

    // 更新処理
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
}
