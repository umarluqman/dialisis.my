import { prisma } from "@/lib/prisma";
import { rateLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  website: z.string().max(0), // Honeypot field
});

export async function POST(request: Request) {
  try {
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Sila cuba selepas sejam." },
        { status: 429 }
      );
    }

    const json = await request.json();
    const body = schema.parse(json);

    // Check honeypot field
    if (body.website) {
      // If honeypot is filled, silently accept but don't save
      return NextResponse.json({ success: true });
    }

    // Save to database
    await prisma.contact.create({
      data: {
        name: body.name,
        email: body.email,
        message: body.message,
        ipAddress: ip,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data tidak sah" }, { status: 400 });
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Ralat dalaman pelayan" },
      { status: 500 }
    );
  }
}
