import { createUser, findUserByEmail, updateUser } from "../db/user.db.js"
import { generateAccessToken, generateRefreshToken } from "../utils/token.utils.js";

export const oauthLogin = async (profile: any) => {
  const email = profile.email ?? profile.emails?.[0]?.value;
  const name = profile.name ?? profile.displayName;
  const googleId = profile.providerId ?? profile.id;

  if (!email || !name) {
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
