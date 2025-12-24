import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/routes";
import { requestLogger } from "./middlewares/logger";

const app: Application = express();

app.disable("x-powered-by");

// Middleware
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 200,
    })
);
app.use(
    helmet({
        contentSecurityPolicy: false,
        frameguard: false,
        crossOriginEmbedderPolicy: false,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use(router);

// 404
app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, error: "Not Found" });
});

export default app;
