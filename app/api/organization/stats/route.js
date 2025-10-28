import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";
import Donation from "@/models/Donation";
import User from "@/models/User";
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

    const [orgCount, userCount, donationAgg] = await Promise.all([
      Organization.countDocuments({}),
      User.countDocuments({}),
      Donation.aggregate([
        { $group: { _id: null, totalProducts: { $sum: "$quantity" }, totalOrders: { $sum: 1 } } },
      ]),
    ]);

    const totalProducts = donationAgg[0]?.totalProducts || 0;
    const totalOrders = donationAgg[0]?.totalOrders || 0;

    return NextResponse.json({ success: true, stats: { orgCount, userCount, totalOrders, totalProducts } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
