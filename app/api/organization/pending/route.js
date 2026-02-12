import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";
import { getAuth } from "@clerk/nextjs/server";

function isAdmin(userId) {
  const admins = (process.env.ADMIN_USER_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  return admins.includes(userId);
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!isAdmin(userId)) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }
    await connectDB();
    const orgs = await Organization.find({ verified: false }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, organizations: orgs });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
