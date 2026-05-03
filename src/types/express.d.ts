import type { findUserByUserId } from "../db/user.db.js";

declare global {
  namespace Express {
    interface Request {
      user?: Awaited<ReturnType<typeof findUserByUserId>>;
    }
  }
}

export {};
