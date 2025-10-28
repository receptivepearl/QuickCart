import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";
import { getAuth } from "@clerk/nextjs/server";
import authOrg from "@/lib/authOrg";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isOrg = await authOrg(userId);
    if (!isOrg) {
      return NextResponse.json({ success: false, message: "Not authorized" });
    }

    const body = await request.json();
    const { name, description, address, lat, lng } = body;

    if (!name || lat === undefined || lng === undefined) {
      return NextResponse.json({ success: false, message: "Missing required fields" });
    }

    await connectDB();

    const org = await Organization.create({
      name,
      description: description || "",
      address: address || "",
      location: { type: "Point", coordinates: [Number(lng), Number(lat)] },
      verified: false,
      ownerUserId: userId,
    });

    return NextResponse.json({ success: true, organization: org });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
