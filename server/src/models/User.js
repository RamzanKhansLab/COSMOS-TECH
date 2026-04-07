import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "seller"], required: true },
    sellerStoreName: { type: String, trim: true }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);

