import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return NextResponse.json({ success: false, message: "lat and lng are required" });
    }

    await connectDB();
    const orgs = await Organization.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          key: "location",
          spherical: true,
          distanceField: "distanceMeters",
        },
      },
      { $limit: limit },
      {
        $project: {
          name: 1,
          description: 1,
          address: 1,
          verified: 1,
          location: 1,
          distanceMeters: 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, organizations: orgs });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
