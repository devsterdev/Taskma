import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  throw new Error("Google OAuth environment variables are not configured");
}
 
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
  },
  function(accessToken, refreshToken, profile, cb) {
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
