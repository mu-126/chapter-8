import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import type { AdminPostsIndexResponse } from "@/_types/Post";

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

    return NextResponse.json<AdminPostsIndexResponse>(
      {
        posts: posts.map((post) => ({
          ...post,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};

// POST /api/admin/posts
export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    // バリデーション
    if (!body.title || !body.content) {
      return NextResponse.json({ message: "titleとcontentは必須です" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        thumbnailUrl: body.thumbnailUrl,

        // post.createの中で「postCategories」を一緒に作る
        postCategories: {
          create: (body.categoryIds ?? []).map((categoryId: number) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};
