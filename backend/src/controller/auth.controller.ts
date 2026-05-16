import type { CookieOptions, Request, Response } from "express";
import { oauthLogin } from "../services/auth.service.js";

const getCookieOptions = (req: Request): CookieOptions => {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const isHttpsRequest =
    req.secure ||
    forwardedProto === "https" ||
    req.hostname !== "localhost";

  return {
    httpOnly: true,
    secure: isHttpsRequest,
    sameSite: isHttpsRequest ? "none" : "lax",
  };
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Google authentication failed",
      });
    }

    const { user, accessToken, refreshToken } = await oauthLogin(req.user);
    const cookieOptions = getCookieOptions(req);

    return res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Google signin successfully",
        user,
      });
  } catch (error) {
    console.error("Google callback error:", error);

    return res.status(500).json({
      message: "Unable to complete Google signin",
    });
  }
};
