import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  role?: string;
}

// 🔐 Access Token
export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: "15m" }
  );
};

// 🔁 Refresh Token
export const generateRefreshToken = (payload: { id: string }) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
};
