import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";

export async function GET(_request, { params }) {
  try {
    const { id } = params;
    await connectDB();
    const org = await Organization.findById(id);
    if (!org) return NextResponse.json({ success: false, message: "Not found" });
    return NextResponse.json({ success: true, organization: org });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
