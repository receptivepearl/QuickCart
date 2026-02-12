import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";
import Donation from "@/models/Donation";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/lib/authAdmin";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Not authorized" });
    }

    await connectDB();

    const [organizations, users, donations, productsCount] = await Promise.all([
      Organization.countDocuments({}),
      User.countDocuments({}),
      Donation.aggregate([{ $group: { _id: null, total: { $sum: "$quantity" } } }]).then(
        (r) => (r[0]?.total || 0)
      ),
      // If product donations become tracked, replace with Donation count if needed
      // Keeping example with existing Product count for admin visibility
      import("@/models/Product").then((m) => m.default.countDocuments({})),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        organizations,
        users,
        totalProductsDonated: donations,
        products: await productsCount,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
