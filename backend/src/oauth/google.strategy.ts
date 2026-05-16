import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Profile, VerifyCallback } from "passport-google-oauth20";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

const googleOAuthConfig = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
  ? {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL || "/auth/google/callback",
    }
  : null;

export const isGoogleOAuthConfigured = googleOAuthConfig !== null;

if (!googleOAuthConfig) {
  console.warn("Google OAuth is disabled because GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not configured.");
} else {
 
passport.use(new GoogleStrategy(
  googleOAuthConfig,
  function(accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      return cb(new Error("Google account did not return an email address"));
    }

    const user = {
      provider: "google",
      providerId: profile.id,
      name: profile.displayName,
      email,
    };

    return cb(null, user);
  }
));
}
