import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

 
passport.use(new GoogleStrategy({
    clientID:  process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!
  },
  function(accessToken, refreshToken, profile, cb) {
    const user = {
        provider: "google",
        providerId: profile.id,
        name: profile.displayName,
        ...(profile.emails?.[0]?.value && { email: profile.emails[0].value }),
      };
    return cb(null, user);
  }
));
