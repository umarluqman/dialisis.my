import { prisma } from "@/lib/db";
import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const center = await prisma.dialysisCenter.findUnique({
    where: { slug: params.slug },
    include: {
      state: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!center) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          padding: "40px 80px",
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {center.title}
        </div>
        <div
          style={{
            fontSize: 30,
            textAlign: "center",
            color: "#666",
          }}
        >
          {center.town}, {center.state.name}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
