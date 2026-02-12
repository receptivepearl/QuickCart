import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "organization", required: true },
    userId: { type: String, ref: "user", required: true },
    productType: { type: String, default: "Menstrual products" },
    quantity: { type: Number, required: true, min: 1 },
    note: { type: String, default: "" },
    status: { type: String, enum: ["placed", "received"], default: "placed" },
  },
  { timestamps: true }
);

const Donation = mongoose.models.donation || mongoose.model("donation", DonationSchema);

export default Donation;
