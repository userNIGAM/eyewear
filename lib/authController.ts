// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// import User from "@/models/User";
// import { connectDB } from "@/lib/mongodb";

// // =========================================================
// // TYPES
// // =========================================================

// interface RegisterRequest {
//     username: string;
//     email: string;
//     password: string;
// }

// interface VerifyOTPRequest {
//     email: string;
//     otp: string;
// }

// interface LoginRequest {
//     identifier: string;
//     password: string;
// }

// interface ForgotPasswordRequest {
//     email: string;
// }

// interface ResetPasswordRequest {
//     email: string;
//     otp: string;
//     newPassword: string;
// }

// // =========================================================
// // HELPER FUNCTIONS
// // =========================================================

// // Generate a 6 digit OTP
// const generateOTP = (): string => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Generate JWT
// const generateToken = (userId: string): string => {
//     const secret = process.env.JWT_SECRET;

//     if (!secret) {
//         throw new Error("JWT_SECRET is not configured");
//     }

//     return jwt.sign(
//         {
//             userId,
//         },
//         secret,
//         {
//             expiresIn: "7d",
//         }
//     );
// };

// // Remove sensitive information before sending user to frontend
// const sanitizeUser = (user: any) => {
//     return {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         isVerified: user.isVerified,
//         createdAt: user.createdAt,
//     };
// };

// // Set authentication cookie
// const setAuthCookie = (
//     response: NextResponse,
//     token: string
// ) => {
//     response.cookies.set({
//         name: "auth_token",
//         value: token,
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7,
//     });
// };

// // =========================================================
// // REGISTER
// // =========================================================

// export const register = async (request: NextRequest) => {
//     try {
//         await connectDB();

//         const body: RegisterRequest = await request.json();

//         const username = body.username?.trim().toLowerCase();
//         const email = body.email?.trim().toLowerCase();
//         const password = body.password;

//         // -------------------------
//         // Validate input
//         // -------------------------

//         if (!username || !email || !password) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Username, email and password are required",
//                 },
//                 { status: 400 }
//             );
//         }

//         if (username.length < 3) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Username must be at least 3 characters",
//                 },
//                 { status: 400 }
//             );
//         }

//         if (password.length < 6) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Password must be at least 6 characters",
//                 },
//                 { status: 400 }
//             );
//         }

//         // -------------------------
//         // Validate email
//         // -------------------------

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!emailRegex.test(email)) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Please enter a valid email address",
//                 },
//                 { status: 400 }
//             );
//         }

//         // -------------------------
//         // Check existing user
//         // -------------------------

//         const existingUser = await User.findOne({
//             $or: [
//                 { email },
//                 { username },
//             ],
//         });

//         if (existingUser) {
//             // If unverified account has expired,
//             // delete it and allow registration again.
//             if (
//                 !existingUser.isVerified &&
//                 existingUser.verificationExpiresAt &&
//                 existingUser.verificationExpiresAt < new Date()
//             ) {
//                 await User.findByIdAndDelete(existingUser._id);
//             } else {
//                 return NextResponse.json(
//                     {
//                         success: false,
//                         message:
//                             existingUser.email === email
//                                 ? "Email is already registered"
//                                 : "Username is already taken",
//                     },
//                     { status: 409 }
//                 );
//             }
//         }

//         // -------------------------
//         // Hash password
//         // -------------------------

//         const hashedPassword = await bcrypt.hash(password, 12);

//         // -------------------------
//         // Generate OTP
//         // -------------------------

//         const otp = generateOTP();

//         const hashedOTP = await bcrypt.hash(otp, 10);

//         const now = new Date();

//         // OTP expires in 10 minutes
//         const verificationOTPExpires = new Date(
//             now.getTime() + 10 * 60 * 1000
//         );

//         // Account expires in 10 minutes
//         const verificationExpiresAt = new Date(
//             now.getTime() + 10 * 60 * 1000
//         );

//         // -------------------------
//         // Create user
//         // -------------------------

//         const user = await User.create({
//             username,
//             email,
//             password: hashedPassword,

//             isVerified: false,

//             verificationOTP: hashedOTP,
//             verificationOTPExpires,

//             verificationExpiresAt,
//         });

//         // TODO:
//         // Send OTP using email service
//         console.log(`Registration OTP for ${email}: ${otp}`);

//         return NextResponse.json(
//             {
//                 success: true,
//                 message:
//                     "Account created successfully. Please verify the OTP sent to your email.",
//                 userId: user._id,

//                 // DEVELOPMENT ONLY
//                 developmentOTP:
//                     process.env.NODE_ENV === "development"
//                         ? otp
//                         : undefined,
//             },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error("Register error:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Something went wrong while creating your account",
//             },
//             { status: 500 }
//         );
//     }
// };

// // =========================================================
// // VERIFY REGISTRATION OTP
// // =========================================================

// export const verifyOTP = async (request: NextRequest) => {
//     try {
//         await connectDB();

//         const body: VerifyOTPRequest = await request.json();

//         const email = body.email?.trim().toLowerCase();
//         const otp = body.otp?.trim();

//         if (!email || !otp) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Email and OTP are required",
//                 },
//                 { status: 400 }
//             );
//         }

//         if (!/^\d{6}$/.test(otp)) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "OTP must be exactly 6 digits",
//                 },
//                 { status: 400 }
//             );
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Account not found",
//                 },
//                 { status: 404 }
//             );
//         }

//         if (user.isVerified) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Account is already verified",
//                 },
//                 { status: 400 }
//             );
//         }

//         // -------------------------
//         // Check account expiration
//         // -------------------------

//         if (
//             user.verificationExpiresAt &&
//             user.verificationExpiresAt < new Date()
//         ) {
//             await User.findByIdAndDelete(user._id);

//             return NextResponse.json(
//                 {
//                     success: false,
//                     message:
//                         "Your 10-minute verification period has expired. Please register again.",
//                 },
//                 { status: 410 }
//             );
//         }

//         // -------------------------
//         // Check OTP expiration
//         // -------------------------

//         if (
//             !user.verificationOTPExpires ||
//             user.verificationOTPExpires < new Date()
//         ) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message:
//                         "OTP has expired. Please request a new OTP.",
//                 },
//                 { status: 410 }
//             );
//         }

//         if (!user.verificationOTP) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message:
//                         "Verification OTP not found. Please request a new OTP.",
//                 },
//                 { status: 400 }
//             );
//         }

//         // -------------------------
//         // Compare OTP
//         // -------------------------

//         const isValidOTP = await bcrypt.compare(
//             otp,
//             user.verificationOTP
//         );

//         if (!isValidOTP) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Invalid OTP",
//                 },
//                 { status: 400 }
//             );
//         }

//         // -------------------------
//         // Verify account
//         // -------------------------

//         user.isVerified = true;

//         user.verificationOTP = undefined;
//         user.verificationOTPExpires = undefined;
//         user.verificationExpiresAt = undefined;

//         await user.save();

//         return NextResponse.json(
//             {
//                 success: true,
//                 message:
//                     "Account verified successfully. You can now login.",
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Verify OTP error:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Something went wrong while verifying your account",
//             },
//             { status: 500 }
//         );
//     }
// };

// // =========================================================
// // RESEND OTP
// // =========================================================

// export const resendOTP = async (request: NextRequest) => {
//     try {
//         await connectDB();

//         const body: { email: string } = await request.json();

//         const email = body.email?.trim().toLowerCase();

//         if (!email) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Email is required",
//                 },
//                 { status: 400 }
//             );
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Account not found",
//                 },
//                 { status: 404 }
//             );
//         }

//         if (user.isVerified) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Account is already verified",
//                 },
//                 { status: 400 }
//             );
//         }

//         // -------------------------
//         // Check account expiration
//         // -------------------------

//         if (
//             user.verificationExpiresAt &&
//             user.verificationExpiresAt < new Date()
//         ) {
//             await User.findByIdAndDelete(user._id);

//             return NextResponse.json(
//                 {
//                     success: false,
//                     message:
//                         "Your verification period has expired. Please register again.",
//                 },
//                 { status: 410 }
//             );
//         }

//         // -------------------------
//         // Generate new OTP
//         // -------------------------

//         const otp = generateOTP();

//         const hashedOTP = await bcrypt.hash(otp, 10);

//         user.verificationOTP = hashedOTP;

//         /*
//          * Only the OTP expiration is changed.
//          *
//          * verificationExpiresAt stays unchanged.
//          */
//         user.verificationOTPExpires = new Date(
//             Date.now() + 10 * 60 * 1000
//         );

//         await user.save();

//         // TODO:
//         // Send OTP using email service
//         console.log(`New OTP for ${email}: ${otp}`);

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "A new OTP has been sent to your email.",

//                 // DEVELOPMENT ONLY
//                 developmentOTP:
//                     process.env.NODE_ENV === "development"
//                         ? otp
//                         : undefined,
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Resend OTP error:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Unable to resend OTP",
//             },
//             { status: 500 }
//         );
//     }
// };

// // =========================================================
// // LOGIN
// // =========================================================

// export const login = async (request: NextRequest) => {
//     try {
//         await connectDB();

//         const body: LoginRequest = await request.json();

//         const identifier = body.identifier?.trim().toLowerCase();
//         const password = body.password;

//         if (!identifier || !password) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message:
//                         "Username/email and password are required",
//                 },
//                 { status: 400 }
//             );
//         }

//         // -------------------------
//         // Find user
//         // -------------------------

//         const user = await User.findOne({
//             $or: [
//                 { email: identifier },
//                 { username: identifier },
//             ],
//         });

//         if (!user) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Invalid username/email or password",
//                 },
//                 { status: 401 }
//             );
//         }

//         // -------------------------
//         // Check verification
//         // -------------------------

//         if (!user.isVerified) {
//             if (
//                 user.verificationExpiresAt &&
//                 user.verificationExpiresAt < new Date()
//             ) {
//                 await User.findByIdAndDelete(user._id);

//                 return NextResponse.json(
//                     {
//                         success: false,
//                         message:
//                             "Your account verification period has expired. Please register again.",
//                     },
//                     { status: 410 }
//                 );
//             }

//             return NextResponse.json(
//                 {
//                     success: false,
//                     message:
//                         "Please verify your email before logging in.",
//                     requiresVerification: true,
//                     email: user.email,
//                 },
//                 { status: 403 }
//             );
//         }

//         // -------------------------
//         // Check password
//         // -------------------------

//         const passwordValid = await bcrypt.compare(
//             password,
//             user.password
//         );

//         if (!passwordValid) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Invalid username/email or password",
//                 },
//                 { status: 401 }
//             );
//         }

//         // -------------------------
//         // Generate JWT
//         // -------------------------

//         const token = generateToken(
//             user._id.toString()
//         );

//         const response = NextResponse.json(
//             {
//                 success: true,
//                 message: "Login successful",
//                 user: sanitizeUser(user),
//             },
//             { status: 200 }
//         );

//         // -------------------------
//         // Assign JWT cookie
//         // -------------------------

//         setAuthCookie(response, token);

//         return response;
//     } catch (error) {
//         console.error("Login error:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Something went wrong while logging in",
//             },
//             { status: 500 }
//         );
//     }
// };

// // =========================================================
// // LOGOUT
// // =========================================================

// export const logout = async () => {
//     try {
//         const response = NextResponse.json(
//             {
//                 success: true,
//                 message: "Logout successful",
//             },
//             { status: 200 }
//         );

//         response.cookies.set({
//             name: "auth_token",
//             value: "",
//             httpOnly: true,
//             expires: new Date(0),
//             path: "/",
//         });

//         return response;
//     } catch (error) {
//         console.error("Logout error:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Unable to logout",
//             },
//             { status: 500 }
//         );
//     }
// };

// // =========================================================
// // GET CURRENT USER
// // =========================================================

// export const getMe = async (request: NextRequest) => {
//     try {
//         await connectDB();

//         const token = request.cookies.get("auth_token")?.value;

//         if (!token) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Not authenticated",
//                 },
//                 { status: 401 }
//             );
//         }

//         const secret = process.env.JWT_SECRET;

//         if (!secret) {
//             throw new Error("JWT_SECRET is not configured");
//         }

//         let decoded: { userId: string };

//         try {
//             decoded = jwt.verify(
//                 token,
//                 secret
//             ) as { userId: string };
//         } catch {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Invalid or expired session",
//                 },
//                 { status: 401 }
//             );
//         }

//         const user = await User.findById(decoded.userId);

//         if (!user) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "User not found",
//                 },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json(
//             {
//                 success: true,
//                 user: sanitizeUser(user),
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Get user error:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Unable to get user information",
//             },
//             { status: 500 }
//         );
//     }
// };

// // =========================================================
// // FORGOT PASSWORD
// // =========================================================

// export const forgotPassword = async (
//     request: NextRequest
// ) => {
//     try {
//         await connectDB();

//         const body: ForgotPasswordRequest =
//             await request.json();

//         const email = body.email?.trim().toLowerCase();

//         if (!email) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Email is required",
//                 },
//                 { status: 400 }
//             );
//         }

//         const user = await User.findOne({ email });

//         /*
//          * We don't reveal whether an email exists.
//          */
//         if (!user) {
//             return NextResponse.json(
//                 {
//                     success: true,
//                     message:
//                         "If an account exists with this email, a password reset OTP has been sent.",
//                 },
//                 { status: 200 }
//             );
//         }

//         if (!user.isVerified) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message:
//                         "Please verify your account before resetting your password.",
//                 },
//                 { status: 403 }
//             );
//         }

//         // -------------------------
//         // Generate reset OTP
//         // -------------------------

//         const otp = generateOTP();

//         const hashedOTP = await bcrypt.hash(otp, 10);

//         user.resetOTP = hashedOTP;

//         user.resetOTPExpires = new Date(
//             Date.now() + 10 * 60 * 1000
//         );

//         await user.save();

//         // TODO:
//         // Send OTP using email service
//         console.log(`Password reset OTP for ${email}: ${otp}`);

//         return NextResponse.json(
//             {
//                 success: true,
//                 message:
//                     "If an account exists with this email, a password reset OTP has been sent.",

//                 // DEVELOPMENT ONLY
//                 developmentOTP:
//                     process.env.NODE_ENV === "development"
//                         ? otp
//                         : undefined,
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Forgot password error:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message:
//                     "Unable to process password reset request",
//             },
//             { status: 500 }
//         );
//     }
// };

// // =========================================================
// // VERIFY RESET OTP
// // =========================================================

// export const verifyResetOTP = async (
//     request: NextRequest
// ) => {
//     try {
//         await connectDB();

//         const body: VerifyOTPRequest =
//             await request.json();

//         const email = body.email?.trim().toLowerCase();
//         const otp = body.otp?.trim();

//         if (!email || !otp) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Email and OTP are required",
//                 },
//                 { status: 400 }
//             );
//         }

//         if (!/^\d{6}$/.test(otp)) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "OTP must be exactly 6 digits",
//                 },
//                 { status: 400 }
//             );
//         }

//         const user = await User.findOne({ email });

//         if (!user || !user.resetOTP) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Invalid OTP",
//                 },
//                 { status: 400 }
//             );
//         }

//         // -------------------------
//         // Check expiration
//         // -------------------------

//         if (
//             !user.resetOTPExpires ||
//             user.resetOTPExpires < new Date()
//         ) {
//             user.resetOTP = undefined;
//             user.resetOTPExpires = undefined;

//             await user.save();

//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Password reset OTP has expired",
//                 },
//                 { status: 410 }
//             );
//         }

//         // -------------------------
//         // Verify OTP
//         // -------------------------

//         const isValidOTP = await bcrypt.compare(
//             otp,
//             user.resetOTP
//         );

//         if (!isValidOTP) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Invalid OTP",
//                 },
//                 { status: 400 }
//             );
//         }

//         return NextResponse.json(
//             {
//                 success: true,
//                 message:
//                     "OTP verified successfully. You can now reset your password.",
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Verify reset OTP error:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Unable to verify reset OTP",
//             },
//             { status: 500 }
//         );
//     }
// };

// // =========================================================
// // RESET PASSWORD
// // =========================================================

// export const resetPassword = async (
//     request: NextRequest
// ) => {
//     try {
//         await connectDB();

//         const body: ResetPasswordRequest =
//             await request.json();

//         const email = body.email?.trim().toLowerCase();
//         const otp = body.otp?.trim();
//         const newPassword = body.newPassword;

//         if (!email || !otp || !newPassword) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message:
//                         "Email, OTP and new password are required",
//                 },
//                 { status: 400 }
//             );
//         }

//         if (!/^\d{6}$/.test(otp)) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "OTP must be exactly 6 digits",
//                 },
//                 { status: 400 }
//             );
//         }

//         if (newPassword.length < 6) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message:
//                         "New password must be at least 6 characters",
//                 },
//                 { status: 400 }
//             );
//         }

//         const user = await User.findOne({ email });

//         if (!user || !user.resetOTP) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Invalid reset request",
//                 },
//                 { status: 400 }
//             );
//         }

//         // -------------------------
//         // Check OTP expiration
//         // -------------------------

//         if (
//             !user.resetOTPExpires ||
//             user.resetOTPExpires < new Date()
//         ) {
//             user.resetOTP = undefined;
//             user.resetOTPExpires = undefined;

//             await user.save();

//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Password reset OTP has expired",
//                 },
//                 { status: 410 }
//             );
//         }

//         // -------------------------
//         // Verify OTP
//         // -------------------------

//         const isValidOTP = await bcrypt.compare(
//             otp,
//             user.resetOTP
//         );

//         if (!isValidOTP) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Invalid OTP",
//                 },
//                 { status: 400 }
//             );
//         }

//         // -------------------------
//         // Hash new password
//         // -------------------------

//         user.password = await bcrypt.hash(
//             newPassword,
//             12
//         );

//         // Clear reset information
//         user.resetOTP = undefined;
//         user.resetOTPExpires = undefined;

//         await user.save();

//         return NextResponse.json(
//             {
//                 success: true,
//                 message:
//                     "Password reset successfully. You can now login.",
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Reset password error:", error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Unable to reset password",
//             },
//             { status: 500 }
//         );
//     }
// };