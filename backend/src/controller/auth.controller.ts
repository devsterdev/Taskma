import type { CookieOptions, Request, Response } from "express";
import { oauthLogin } from "../services/auth.service.js";

const getFrontendUrl = () => {
  return (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
};

const getCookieOptions = (req: Request): CookieOptions => {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const isLocalhost =
    req.hostname === "localhost" ||
    req.hostname === "127.0.0.1" ||
    req.hostname === "::1";
  const isHttpsRequest =
    req.secure ||
    forwardedProto === "https" ||
    !isLocalhost;

  return {
  httpOnly: true,
  secure: isHttpsRequest,
  sameSite: isHttpsRequest ? "none" : "lax",
  domain: isHttpsRequest
    ? "taskma-p59o.onrender.com"
    : undefined,
  path: "/",
};
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.redirect(`${getFrontendUrl()}/?oauth=failed`);
    }

    const { accessToken, refreshToken } = await oauthLogin(req.user);
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
      .redirect(`${getFrontendUrl()}/?oauth=success`);
  } catch (error) {
    console.error("Google callback error:", error);

    return res.redirect(`${getFrontendUrl()}/?oauth=failed`);
  }
};
