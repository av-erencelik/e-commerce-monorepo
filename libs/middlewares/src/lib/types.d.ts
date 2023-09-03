declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        verificated: boolean;
        fullName: string;
        isAdmin: boolean;
      };
    }
  }
}

export {};
