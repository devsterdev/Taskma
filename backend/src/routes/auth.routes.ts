import express from "express";

import passport from "passport";
import type { AuthenticateOptions } from "passport";
import { isGoogleOAuthConfigured } from "../oauth/google.strategy.js";

import {
  googleCallback,
}
from "../controller/auth.controller.js";

const router = express.Router();
const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

const getGoogleCallbackUrl = (req: express.Request) => {
  const envCallbackUrl = process.env.GOOGLE_CALLBACK_URL;
  const renderHostname = process.env.RENDER_EXTERNAL_HOSTNAME;
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  const requestOrigin = `${protocol || req.protocol}://${req.get("host")}`;

  if (req.hostname === "localhost" || req.hostname === "127.0.0.1") {
    return `${requestOrigin}/auth/google/callback`;
  }

  if (envCallbackUrl) {
    return envCallbackUrl;
  }

  if (renderHostname) {
    return `https://${renderHostname}/auth/google/callback`;
  }

  return `${requestOrigin}/auth/google/callback`;
};

const requireGoogleOAuthConfig: express.RequestHandler = (req, res, next) => {
  if (!isGoogleOAuthConfigured) {
    return res.status(503).json({
      message: "Google OAuth is not configured",
    });
  }

  return next();
};

type GoogleAuthenticateOptions = AuthenticateOptions & {
  callbackURL: string;
  prompt?: string;
  scope?: string[];
};

router.get(
  "/google",
  requireGoogleOAuthConfig,
  (req, res, next) => {
    const options: GoogleAuthenticateOptions = {
      scope: ["profile", "email"],
      session: false,
      callbackURL: getGoogleCallbackUrl(req),
      prompt: "select_account",
    };

    passport.authenticate("google", options)(req, res, next);
  }
);

router.get(
  "/google/callback",
  requireGoogleOAuthConfig,
  (req, res, next) => {
    const options: GoogleAuthenticateOptions = {
      session: false,
      callbackURL: getGoogleCallbackUrl(req),
    };

    passport.authenticate("google", options, (error: Error | null, user: Express.User | false, info: unknown) => {
      if (error || !user) {
        console.error("Google authentication failed:", error || info);
        return res.redirect(`${frontendUrl}/?oauth=failed`);
      }

      req.user = user;
      return next();
    })(req, res, next);
  },
  googleCallback
);


export default router;
