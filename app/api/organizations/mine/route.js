import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" });
    await connectDB();
    const org = await Organization.findOne({ ownerUserId: userId });
    if (!org) return NextResponse.json({ success: false, message: "No organization found" });
    return NextResponse.json({ success: true, organization: org });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
