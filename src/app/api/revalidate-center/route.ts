import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { buildCenterRevalidationPaths } from "@/lib/site-revalidation-paths.mjs";

export const dynamic = "force-dynamic";

function getSecret() {
  return process.env.DIALISIS_MY_REVALIDATE_SECRET;
}

function isAuthorized(request: NextRequest, secret: string) {
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  const secret = getSecret();

  if (!secret) {
    return NextResponse.json(
      { error: "Revalidation secret is not configured" },
      { status: 500 }
    );
  }

  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const paths = buildCenterRevalidationPaths(payload);

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    paths,
  });
}
