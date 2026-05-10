import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";

// 記事詳細APIのレスポンスの型
export type PostShowResponse = {
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
  };
};

// GET /api/posts/[id]
export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    const postId = Number(params.id); // URLのidは文字列なのでDB用に数値に変換する

    const post = await prisma.post.findUnique({
      where: {
        id: postId, // ← どの記事？idを指定する
      },
      include: {
        // そのままでOK
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // データがなかった場合
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json<PostShowResponse>({ post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};
