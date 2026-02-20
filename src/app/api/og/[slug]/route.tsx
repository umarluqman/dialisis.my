import { createClient, Client } from "@libsql/client";
import { ImageResponse } from "@vercel/og";

export const runtime = "nodejs";

let db: Client | null = null;

function getDb() {
  if (!db) {
    db = createClient({
      url: `${process.env.TURSO_DATABASE_URL}`,
      authToken: `${process.env.TURSO_AUTH_TOKEN}`,
    });
  }
  return db;
}

interface CenterResult {
  title: string;
  town: string;
  state_name: string;
}

function formatSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  let center: CenterResult = {
    title: formatSlug(params.slug),
    town: "Malaysia",
    state_name: "",
  };

  try {
    const result = await getDb().execute({
      sql: `SELECT dc.title, dc.town, s.name as state_name 
            FROM DialysisCenter dc 
            JOIN State s ON dc.stateId = s.id 
            WHERE dc.slug = ?`,
      args: [params.slug],
    });

    const row = result.rows[0];

    if (row) {
      center = {
        title: String(row.title),
        town: String(row.town),
        state_name: String(row.state_name),
      };
    }
  } catch (error) {
    console.error("Error generating OG image:", error);
  }

  const stateLabel = center.state_name
    ? center.state_name.replace(/-/g, " ")
    : "Malaysia";

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
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 58,
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
            display: "flex",
            fontSize: 30,
            textAlign: "center",
            color: "#666",
          }}
        >
          {`${center.town}, ${stateLabel}`}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
