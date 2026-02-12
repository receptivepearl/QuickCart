import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "USA" },
    // GeoJSON Point [lng, lat]
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere", required: true },
    },
    verified: { type: Boolean, default: false },
    ownerUserId: { type: String, required: true, ref: "user" },
  },
  { timestamps: true }
);

// Ensure index is created for geo queries
OrganizationSchema.index({ location: "2dsphere" });

const Organization =
  mongoose.models.organization ||
  mongoose.model("organization", OrganizationSchema);

export default Organization;
