import { createUser, findUserByEmail, updateUser, updateUserGoogleId } from "../db/user.db.js"
import { generateAccessToken, generateRefreshToken } from "../utils/token.utils.js";

type GoogleProfile = {
  email?: string;
  name?: string;
  providerId?: string;
  emails?: Array<{ value?: string }>;
  displayName?: string;
  id?: string | number;
};

export const oauthLogin = async (profile: GoogleProfile) => {
  const email = profile.email ?? profile.emails?.[0]?.value;
  const name = profile.name ?? profile.displayName;
  const googleId = String(profile.providerId ?? profile.id ?? "");

  if (!email || !name || !googleId) {
    throw new Error("Google profile is missing required user details");
  }

  let user = await findUserByEmail(email)

  if (!user) {
    user = await createUser({
      email,
      name,
      googleId,
      password: null,
      refreshToken: "",
    })
  } else if (!user.googleId) {
    user = await updateUserGoogleId(user.id, googleId);
  }

  const accessToken = generateAccessToken(user.id);

  const refreshToken = generateRefreshToken(user.id);

  const safeUser = await updateUser(user.id, refreshToken)

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
}
