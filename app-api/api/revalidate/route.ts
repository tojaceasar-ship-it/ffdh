import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const secret = process.env.REVALIDATE_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: "Revalidation not configured" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { path, tag } = body;

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path });
    }

    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, tag });
    }

    return NextResponse.json(
      { error: "path or tag required" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error revalidating" },
      { status: 500 }
    );
  }
}

