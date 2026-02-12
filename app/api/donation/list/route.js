import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Donation from "@/models/Donation";

// Query params: organizationId
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");
    if (!organizationId) {
      return NextResponse.json({ success: false, message: "organizationId is required" }, { status: 400 });
    }

    await connectDB();

    const donations = await Donation.find({ organizationId }).sort({ createdAt: -1 }).lean();
    const totalProducts = donations.reduce((sum, d) => sum + (d.quantity || 0), 0);

    return NextResponse.json({ success: true, donations, totalProducts, totalOrders: donations.length });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
