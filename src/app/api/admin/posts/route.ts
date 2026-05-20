import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";

// レスポンスの型
export type AdminPostsIndexResponse = {
  posts: {
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
  }[];
};

// GET /api/admin/posts
export const GET = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc", // 新しい順
      },
      include: {
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

    return NextResponse.json<AdminPostsIndexResponse>({ posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};
