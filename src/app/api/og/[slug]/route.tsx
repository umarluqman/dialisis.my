import { createClient } from "@libsql/client";
import { ImageResponse } from "@vercel/og";
import { NextResponse } from "next/server";

export const runtime = "edge";

const db = createClient({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});

const interRegular = fetch(
  new URL(
    "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
  )
).then((res) => res.arrayBuffer());

interface CenterResult {
  title: string;
  town: string;
  state_name: string;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const result = await db.execute({
      sql: `SELECT dc.title, dc.town, s.name as state_name 
            FROM DialysisCenter dc 
            JOIN State s ON dc.stateId = s.id 
            WHERE dc.slug = ?`,
      args: [params.slug],
    });

    const row = result.rows[0];

    if (!row) {
      return new NextResponse("Not found", { status: 404 });
    }

    const center: CenterResult = {
      title: String(row.title),
      town: String(row.town),
      state_name: String(row.state_name),
    };

    const fontData = await interRegular;

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
            fontFamily: "Inter",
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 20,
              color: "#000",
              lineHeight: 1.2,
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
            {center.town}, {center.state_name.replace(/-/g, " ")}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
          },
        ],
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new NextResponse("Error generating image", { status: 500 });
  }
}
