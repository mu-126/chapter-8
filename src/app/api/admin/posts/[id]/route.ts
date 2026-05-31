import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";

// レスポンスの型
export type AdminPostDetailResponse = {
  post: {
    id: number;
    title: string;
    content: string;
    thumbnailUrl: string;
    createdAt: Date;
    updatedAt: Date;
    postCategories: {
      category: {
        id: number;
        name: string;
      };
    }[];
  } | null;
};

// GET: 記事詳細取得
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // paramsをawait
    const { id } = await params;
    const postId = Number(id);

    if (isNaN(postId)) {
      return NextResponse.json({ message: "IDが不正です" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        postCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ message: "記事が見つかりません" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
}

// PUT: 記事更新
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = Number(id);

    if (isNaN(postId)) {
      return NextResponse.json({ message: "IDが不正です" }, { status: 400 });
    }

    // リクエストボディ取得
    const body = await request.json();
    const { title, content, thumbnailUrl, categoryIds } = body;

    // バリデーション（最低限）
    if (!title || !content) {
      return NextResponse.json({ message: "タイトルと内容は必須です" }, { status: 400 });
    }

    // 記事が存在するかチェック
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ message: "記事が見つかりません" }, { status: 404 });
    }

    // 更新処理
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        thumbnailUrl,

        // カテゴリ更新（全削除→再作成）
        postCategories: {
          //deleteMany: {},
          /* create:
            categoryIds?.map((categoryId: number) => ({
              category: {
                connect: { id: categoryId },
              },
            })) || [], */
        },
      },
      include: {
        postCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
}

// DELETE: 記事削除API
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    const postId = Number(id);

    // 中間テーブル削除（必要なら）
    await prisma.postCategory.deleteMany({
      where: { postId },
    });

    // 投稿削除
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "削除成功" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
};
