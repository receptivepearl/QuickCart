import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const verified = searchParams.get("verified");

    await connectDB();
    const filter = {};
    if (verified === "true") filter.verified = true;
    if (verified === "false") filter.verified = false;

    const orgs = await Organization.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, organizations: orgs });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
