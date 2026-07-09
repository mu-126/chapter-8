import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { AdminCategoriesIndexResponse } from "@/_types/Category";

// 一覧取得（GET）
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc", // 新しい順
      },
    });

    return NextResponse.json<AdminCategoriesIndexResponse>({
      categories: categories.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json<ErrorResponse>({ message: "サーバーエラー" }, { status: 500 });
  }
}

// 新規作成（POST）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    // バリデーション
    if (!name) {
      return NextResponse.json({ message: "nameは必須です" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json<AdminCategoryCreateResponse>(
      {
        category: {
          ...category,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json<ErrorResponse>({ message: "サーバーエラー" }, { status: 500 });
  }
}
