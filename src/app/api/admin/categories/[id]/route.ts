import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { AdminCategoryShowResponse, ErrorResponse, DeleteResponse } from "@/_types/Category";

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

    const formatCategory = (category: any) => ({
      ...category,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      posts: category.posts.map((p: any) => ({
        post: {
          ...p.post,
          createdAt: p.post.createdAt.toISOString(),
          updatedAt: p.post.updatedAt.toISOString(),
        },
      })),
    });

    return NextResponse.json<AdminCategoryShowResponse>({
      category: formatCategory(category),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json<ErrorResponse>({ message: "サーバーエラー" }, { status: 500 });
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

    return NextResponse.json<AdminCategoryShowResponse>({
      category: {
        ...updatedCategory,
        createdAt: updatedCategory.createdAt.toISOString(),
        updatedAt: updatedCategory.updatedAt.toISOString(),
        posts: [],
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json<ErrorResponse>({ message: "サーバーエラー" }, { status: 500 });
  }
}

// DELETE: カテゴリー削除
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const categoryId = Number(id);

    // ① 存在チェック
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ message: "カテゴリーが見つかりません" }, { status: 404 });
    }

    // ② 中間テーブル削除（重要）
    await prisma.postCategory.deleteMany({
      where: { categoryId },
    });

    // ③ カテゴリー削除
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json<DeleteResponse>({ message: "削除しました" });
  } catch (error) {
    console.error(error);
    return NextResponse.json<ErrorResponse>({ message: "サーバーエラー" }, { status: 500 });
  }
}
