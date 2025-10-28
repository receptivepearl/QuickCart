import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description = "",
      addressLine1,
      addressLine2 = "",
      city,
      state,
      postalCode,
      country = "USA",
      lat,
      lng,
    } = body;

    if (!name || !addressLine1 || !city || !state || !postalCode || lat === undefined || lng === undefined) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const org = await Organization.create({
      name,
      description,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      location: { type: "Point", coordinates: [Number(lng), Number(lat)] },
      verified: false,
      ownerUserId: userId,
    });

    return NextResponse.json({ success: true, organization: org });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
