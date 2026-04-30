import { createUser, findUserByEmail } from "../db/user.db.js"
import type { Request, Response } from "express";
import bcrypt from "bcrypt";


const registerUser = async (req: Request, res: Response) => {
  const {email, username, name, password} = req.body

  if (
    [email, username, name, password].some((field) => field?.trim() === "")
  ) {
    return res.json({
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
    return res.status(201).json({
      message: "User created successfully",
      user,
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

export {registerUser}