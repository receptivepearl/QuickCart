import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Donation from "@/models/Donation";
import Organization from "@/models/Organization";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { organizationId, quantity, description } = await request.json();

    if (!organizationId || !quantity || quantity <= 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB();

    const org = await Organization.findById(organizationId);
    if (!org || !org.verified) {
      return NextResponse.json({ success: false, message: "Organization not verified" });
    }

    const donation = await Donation.create({
      userId,
      organizationId,
      quantity: Number(quantity),
      description: description || "",
    });

    return NextResponse.json({ success: true, donation });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    await connectDB();

    const filter = organizationId ? { organizationId } : {};
    const donations = await Donation.find(filter).sort({ date: -1 });

    return NextResponse.json({ success: true, donations });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
