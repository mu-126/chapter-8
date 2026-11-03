import { prisma } from "@/app/_libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { AdminPostsIndexResponse, AdminPostDetailResponse, Post, PostResponse } from "@/_types/Post";
import { supabase } from "@/app/_libs/supabase";

const formatPost = (post: Post): PostResponse => ({
  ...post,
  createdAt: post.createdAt.toISOString(),
  updatedAt: post.updatedAt.toISOString(),
});

// GET /api/admin/posts
export const GET = async (request: NextRequest) => {
  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get("Authorization") ?? "";

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) return NextResponse.json({ status: error.message }, { status: 400 });

  // tokenが正しい場合、以降が実行される

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
        posts: posts.map(formatPost),
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
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error) return NextResponse.json({ status: error.message }, { status: 400 });

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

    return NextResponse.json<AdminPostDetailResponse>(
      {
        post: formatPost(post),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};
