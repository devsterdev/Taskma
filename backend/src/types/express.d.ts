import type { findUserByUserId } from "../db/user.db.ts";

declare global {
  namespace Express {
    interface Request {
      user?: Awaited<ReturnType<typeof findUserByUserId>>;
    }
  }
}

export {};
