import { PrismaClient, User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { AppError } from "@/utils/error";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const createToken = (user: User) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "3h",
    }
  );
  const refreshToken = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "30d",
    }
  );
  return { accessToken, refreshToken };
};

const refreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string
  ) as { id: string; role: string; email: string };
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return createToken(user);
};

const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="text-align: center; color: #333;">🔐 Xác minh địa chỉ email của bạn</h2>
      <p>Xin chào,</p>
      <p>Bạn đã đăng ký tài khoản trên <strong>Hệ thống quản lý Homestay</strong>. Vui lòng nhấn vào nút bên dưới để xác minh địa chỉ email của bạn:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Xác minh email
        </a>
      </div>
  
      <p>Nếu nút không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
      <div style="word-break: break-all; color: #555;">${verificationUrl}</div>
  
      <hr style="margin: 30px 0;" />
      <p style="font-size: 12px; color: #999;">Liên kết này sẽ hết hạn sau 1 giờ. Nếu bạn không thực hiện hành động này, vui lòng bỏ qua email này.</p>
      <p style="font-size: 12px; color: #999;">Trân trọng,<br />Đội ngũ phát triển Homestay</p>
    </div>
  `,
  };
  await transporter.sendMail(mailOptions);
};

const getUsers = async (page: number, limit: number) => {
  const users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  return users.map((user) => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

const login = async (email: string, password: string) => {
  const user = (await prisma.user.findUnique({
    where: { email },
  })) as User | null;

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.emailVerified) {
    throw new AppError("Please verify your email first", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid password", 401);
  }
  const { password: _, ...userWithoutPassword } = user;
  const token = createToken(user);

  return { user: userWithoutPassword, token };
};

const register = async (name: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
    },
  });

  const verificationToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_VERIFICATION_SECRET as string,
    { expiresIn: "1h" }
  );

  await sendVerificationEmail(email, verificationToken);

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const verifyEmail = async (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_VERIFICATION_SECRET as string
    ) as { id: string; email: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.emailVerified) {
      throw new AppError("Email already verified", 400);
    }

    if (user.email !== decoded.email) {
      throw new AppError("Invalid verification token", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    return { message: "Email verified successfully" };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid or expired verification token", 400);
    }
    throw error;
  }
};

const resendVerificationEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.emailVerified) {
    throw new AppError("Email already verified", 400);
  }

  const verificationToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_VERIFICATION_SECRET as string,
    { expiresIn: "1h" }
  );

  await sendVerificationEmail(email, verificationToken);

  return { message: "Verification email sent" };
};

const sendResetPasswordEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Đặt lại mật khẩu",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="text-align: center; color: #333;">🔑 Đặt lại mật khẩu của bạn</h2>
      <p>Xin chào,</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn trên <strong>Hệ thống quản lý Homestay</strong>. Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Đặt lại mật khẩu
        </a>
      </div>
  
      <p>Nếu nút không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
      <div style="word-break: break-all; color: #555;">${resetUrl}</div>
  
      <hr style="margin: 30px 0;" />
      <p style="font-size: 12px; color: #999;">Liên kết này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      <p style="font-size: 12px; color: #999;">Trân trọng,<br />Đội ngũ phát triển Homestay</p>
    </div>
  `,
  };
  await transporter.sendMail(mailOptions);
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const resetToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_RESET_PASSWORD_SECRET as string,
    { expiresIn: "1h" }
  );

  // Update user with reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
    },
  });

  await sendResetPasswordEmail(email, resetToken);

  return { message: "Password reset email sent" };
};

const resetPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_RESET_PASSWORD_SECRET as string
    ) as { id: string; email: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.resetToken || user.resetToken !== token) {
      throw new AppError("Invalid reset token", 400);
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      throw new AppError("Reset token has expired", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: "Password reset successfully" };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid or expired reset token", 400);
    }
    throw error;
  }
};

const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError("Current password is incorrect", 401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully" };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

interface UserUpdateData {
  name?: string;
  phoneNumber?: string;
}

const updateUser = async (userId: string, data: UserUpdateData) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
    },
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

const softDeleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.active) {
    throw new AppError("User is already deactivated", 400);
  }

  const deactivatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      active: false,
    },
  });

  const { password: _, ...userWithoutPassword } = deactivatedUser;
  return userWithoutPassword;
};

export default {
  getUsers,
  login,
  register,
  refreshToken,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
  softDeleteUser,
  getUserById,
};
