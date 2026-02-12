import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";

// Query params: lat, lng, limit (default 10)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const limit = Number(searchParams.get("limit")) || 10;

    await connectDB();

    let query = {};
    let sort = {};

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      query = {
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: 100000, // 100km default radius
          },
        },
      };
    } else {
      sort = { createdAt: -1 };
    }

    const orgs = await Organization.find(query).sort(sort).limit(limit).lean();

    return NextResponse.json({ success: true, organizations: orgs });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
