import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";

// レスポンスの型
export type AdminCategoriesIndexResponse = {
  categories: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc", // 新しい順
      },
    });

    return NextResponse.json<AdminCategoriesIndexResponse>({
      categories,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
}
