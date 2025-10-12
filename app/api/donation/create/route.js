import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Donation from "@/models/Donation";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { organizationId, quantity, note = "", productType = "Menstrual products" } = body;
    if (!organizationId || !quantity) {
      return NextResponse.json({ success: false, message: "organizationId and quantity are required" }, { status: 400 });
    }

    await connectDB();

    const donation = await Donation.create({
      organizationId,
      userId,
      quantity: Number(quantity),
      note,
      productType,
    });

    return NextResponse.json({ success: true, donation });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
