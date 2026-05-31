import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";

// レスポンスの型
export type AdminCategoryShowResponse = {
  category: {
    id: number;
    name: string;
    postCategories: {
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
export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
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
};
