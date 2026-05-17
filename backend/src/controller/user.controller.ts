import 'dotenv/config'
import { createUser, findUserByEmail, updateUser } from "../db/user.db.js"
import { generateAccessAndRefreshTokens } from '../utils/token.utils.js';
import type { CookieOptions, Request, Response } from "express";
import bcrypt from "bcrypt";

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

const registerUser = async (req: Request, res: Response) => {
  const {email, name, password} = req.body

  if (
    [email, name, password].some((field) => field?.trim() === "")
  ) {
    return res.status(400).
      json({
        message: "all fields require"
      })
  }

  const existedUser = await findUserByEmail(email)
  if(existedUser){
    return res.status(400)
      .json({ message: "User already exists" });
  }
  
  try{
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      email, 
      name,
      password: hashedPassword,
      refreshToken: ""
    })

    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user.id);
    const safeUser = await updateUser(user.id, refreshToken);
    const cookieOptions = getCookieOptions(req);

    return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    })

    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

  .status(200)

  .json({
    message: "User signin successfully",
    user: safeUser
  })
  }
  catch (e: any) {
    console.error("Register user error:", e);

    if (e.code === "P2002") {
      return res.status(400).
        json({
          message: "Duplicate field (email)",
        });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }

}

const signInUser = async(req: Request, res: Response) => {
  const {email, password} = req.body

  if (
    [email].some((field) => field?.trim() === "")
  ) {
    return res.status(400).json({
      message: "all fields require"
    })
  }
  try{
    const existedUser = await findUserByEmail(email)
    if(!existedUser){
      return res.status(400).json({
        message: "User don't exist"
      })
    }

    if (!existedUser.password) {
      return res.status(400).json({
        message: "Please sign in with Google or set a password"
      });
    }

    const isMatch = await bcrypt.compare(password, existedUser.password);

    if(!isMatch){
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(existedUser.id);
    const safeUser = await updateUser(existedUser.id, refreshToken);
    const cookieOptions = getCookieOptions(req);

    return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    })

    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    .status(200)

    .json({
      message: "User signin successfully",
      user: safeUser
    })

  }
  catch(e: any){
    console.error("Signin user error:", e);

    return res.status(500).json({
      message: "user not able to login",
    });
  }
  
}

const logOutUser = async(req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        message: "Unauthorized request"
      });
    }

    await updateUser(user.id, "");
    const cookieOptions = getCookieOptions(req);

    return res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json({
        message: "User logged out successfully"
      });
  } catch (e: any) {
    return res.status(500).json({
      message: "Unable to logout user"
    });
  }
}

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        message: "Unauthorized request"
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (e: any) {
    console.error("Get user profile error:", e);

    return res.status(500).json({
      message: "Unable to fetch user profile"
    });
  }
}


export {registerUser, signInUser, logOutUser, getUserProfile}
