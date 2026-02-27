import { emailRegex, hashPassword } from "../lib/utils";
import { Schema, model } from "mongoose";
import { IUserDocument } from "../types";

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        validator: (value: string) => emailRegex.test(value),
        message: "Invalid email address",
      },
    },
    full_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true, // createAd & updatedAt
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await hashPassword(this.password);
});

export const UserModel = model<IUserDocument>("User", userSchema);
