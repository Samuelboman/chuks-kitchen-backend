import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);
export default Food;