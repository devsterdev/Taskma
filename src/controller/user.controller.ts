import 'dotenv/config'
import { createUser, findUserByEmail } from "../db/user.db.js"
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'


const registerUser = async (req: Request, res: Response) => {
  const {email, username, name, password} = req.body

  if (
    [email, username, name, password].some((field) => field?.trim() === "")
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
      username,
      name,
      password: hashedPassword
    })

    const JWT_SECRET = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }
    
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "1h" }
      
    )
    const { password: _, ...safeUser } = user;

    return res.status(201).json({
      token,
      message: "User created successfully",
      user: safeUser,
    });
  }
  catch (e: any) {
    if (e.code === "P2002") {
      return res.status(400).json({
        message: "Duplicate field (email or username)",
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
    [email, password].some((field) => field?.trim() === "")
  ) {
    return res.json({
      message: "all fields require"
    })
  }
  try{
    const existedUser = await findUserByEmail(email)
    if(!existedUser){
      return res.json({
        mesaage: "User don't exist"
      })
    }

    const isMatch = await bcrypt.compare(password, existedUser.password);

    if(!isMatch){
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const JWT_SECRET = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }
      
    const token = jwt.sign(
      { userId: existedUser.id },
      JWT_SECRET,
      { expiresIn: "1h" }
    )

    const { password: _, ...safeUser } = existedUser;

    return res.status(200).json({
      token,
      message: "User signin successfully",
      user: safeUser,
    });

  }
  catch(e: any){
    return res.status(500).json({
      message: "user not able to login",
    });
  }
  
}



export {registerUser, signInUser}