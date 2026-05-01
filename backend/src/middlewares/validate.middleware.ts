import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateSchema = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Validation failed',
          errors: (error as z.ZodError<any>).issues,
        });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
};
