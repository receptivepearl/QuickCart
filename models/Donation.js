import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "organization",
  },
  quantity: { type: Number, required: true, min: 1 },
  description: { type: String, default: "" },
  status: {
    type: String,
    required: true,
    default: "placed",
    enum: ["placed", "received", "cancelled"],
  },
  date: { type: Number, required: true, default: () => Date.now() },
});

const Donation =
  mongoose.models.donation || mongoose.model("donation", donationSchema);

export default Donation;
