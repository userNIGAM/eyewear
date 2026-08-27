import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;

    // Account verification
    isVerified: boolean;
    verificationOTP?: string;
    verificationOTPExpires?: Date;

    // Password reset
    resetOTP?: string;
    resetOTPExpires?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username cannot exceed 30 characters"],
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

        // -------------------------
        // Account Verification
        // -------------------------

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

        // -------------------------
        // Password Reset
        // -------------------------

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
    }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;