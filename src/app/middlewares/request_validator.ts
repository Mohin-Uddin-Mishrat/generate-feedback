import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const RequestValidator = (schema: z.ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (err) {
            next(err);
        }
    };
};

export default RequestValidator;