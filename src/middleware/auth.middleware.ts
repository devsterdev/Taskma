import 'dotenv/config'
import type { Request, Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserByUserId } from '../db/user.db.js';

export const verifyJWT = async (req: Request, res: Response, next:NextFunction) => {
  try{
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if(!token){
      return res.status(401).
        json({
          message: "This request is not authenticated"
        })
    }

    const JWT_SECRET = process.env.JWT_SECRET_KEY
    if(!JWT_SECRET){
      return res.status(500).
        json({
          message: "Internal server error"
        });
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    
    const decodedToken = decoded as jwt.JwtPayload & { userId: number };

    const user = await findUserByUserId(decodedToken.userId)

    if(!user){
      return res.status(401).
        json({
          message: "Unauthorized: User not found"
        })
    }

    // @ts-ignore
    req.user = user
    next()
  }
  catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired"
      });
    }

    return res.status(401).json({
      message: "Invalid access token"
    });
  }


}
