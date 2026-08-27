import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;

  // User Role
  role: "user" | "admin";

  // Account verification
  isVerified: boolean;
  verificationOTP?: string;
  verificationOTPExpires?: Date;
  verificationExpiresAt?: Date;

  // Password reset
  resetOTP?: string;
  resetOTPExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    // User Role
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Role must be either user or admin",
      },
      default: "user",
      required: true,
    },

    // Account Verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationOTP: {
      type: String,
      default: undefined,
    },

    verificationOTPExpires: {
      type: Date,
      default: undefined,
    },

    verificationExpiresAt: {
      type: Date,
      default: undefined,
    },

    // Password Reset
    resetOTP: {
      type: String,
      default: undefined,
    },

    resetOTPExpires: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically delete unverified accounts
// when verificationExpiresAt is reached.
UserSchema.index(
  { verificationExpiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: {
      isVerified: false,
    },
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
