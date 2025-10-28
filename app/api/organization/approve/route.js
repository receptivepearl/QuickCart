import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";
import { getAuth } from "@clerk/nextjs/server";

function isAdmin(userId) {
  const admins = (process.env.ADMIN_USER_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  return admins.includes(userId);
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!isAdmin(userId)) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { orgId, verified } = await request.json();
    if (!orgId) {
      return NextResponse.json({ success: false, message: "orgId is required" }, { status: 400 });
    }

    await connectDB();
    const updated = await Organization.findByIdAndUpdate(orgId, { verified: verified !== false }, { new: true });
    return NextResponse.json({ success: true, organization: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
