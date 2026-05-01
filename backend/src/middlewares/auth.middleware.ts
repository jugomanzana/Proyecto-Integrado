import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Token missing from authorization header' });
      return;
    }

    jwt.verify(token, (process.env.JWT_SECRET as string) || 'secret', (err, user) => {
      if (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
      }
      req.user = user as { id: number; role: string };
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization header missing' });
  }
};

export const authorizeRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};
