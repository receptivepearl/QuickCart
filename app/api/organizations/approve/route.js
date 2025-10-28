import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";
import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/lib/authAdmin";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Not authorized" });
    }

    const { organizationId, verified } = await request.json();
    if (!organizationId) {
      return NextResponse.json({ success: false, message: "organizationId required" });
    }

    await connectDB();
    const org = await Organization.findByIdAndUpdate(
      organizationId,
      { verified: verified !== false },
      { new: true }
    );

    return NextResponse.json({ success: true, organization: org });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
