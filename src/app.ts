import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors';
import globalErrorHandler from './app/middlewares/global_error_handler'
import notFound from './app/middlewares/not_found_api'
import cookieParser from 'cookie-parser'
import appRouter from './routes'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './app/configs/swagger';

// define app
const app = express()

// middleware
app.use(cors({
    origin: ["http://localhost:3000"]
}))
app.use(express.json({ limit: "100mb" }))
app.use(express.raw())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec));
app.get("/api-docs-json", (req, res) => res.json(swaggerSpec));






app.use("/api", appRouter)

// stating point
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running successful !!',
        data: null,
    });
});

// global error handler
app.use(globalErrorHandler);
app.use(notFound);

// export app
export default app;
