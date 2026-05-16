declare global {
  namespace Express {
    interface User {
      id?: number;
      email?: string;
      name?: string;
      createdAt?: Date;
      provider?: string;
      providerId?: string;
    }
  }
}

export {};
