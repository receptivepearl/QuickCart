import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    address: { type: String, default: "" },
    // GeoJSON Point: [longitude, latitude]
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        // Expect [lng, lat]
        validate: {
          validator: function (coords) {
            return Array.isArray(coords) && coords.length === 2;
          },
          message: "location.coordinates must be [lng, lat]",
        },
      },
    },
    verified: { type: Boolean, default: false },
    ownerUserId: { type: String, required: true, ref: "user" },
    createdAt: { type: Number, default: () => Date.now() },
  },
  { minimize: false }
);

organizationSchema.index({ location: "2dsphere" });

const Organization =
  mongoose.models.organization ||
  mongoose.model("organization", organizationSchema);

export default Organization;
