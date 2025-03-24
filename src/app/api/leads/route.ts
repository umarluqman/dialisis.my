import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate the data
    if (!data.name || !data.email || !data.zipCode) {
      return NextResponse.json(
        { error: "Maklumat yang diperlukan tidak lengkap" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send notification email
    // 3. Integrate with CRM

    // For now, we'll just log and return success
    console.log("Lead received:", data);

    // Example database insertion (replace with your actual DB logic)
    // await db.leads.create({ data });

    return NextResponse.json(
      { success: true, message: "Maklumat telah berjaya dihantar" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing lead:", error);
    return NextResponse.json(
      { error: "Gagal memproses penghantaran maklumat" },
      { status: 500 }
    );
  }
}
