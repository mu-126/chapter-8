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
