// Express
import express, { Application, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import db from "./config/db.js";

import { tripRoutes } from "./api/trips/trips.routes.js";
import { userRoutes } from "./api/users/users.routes.js";
import { itineraryRoutes } from "./api/itinerary/itinerary.routes.js";
import { dayRoutes } from "./api/days/days.routes.js";
import { activityRoutes } from "./api/activity/activity.routes.js";

import dns from "dns";
import { notificationRoutes } from "./api/notifications/notifications.routes.js";
import { commentRoutes } from "./api/comments/comments.routes.js";
import { taskRoutes } from "./api/tasks/tasks.routes.js";
import { updateRoutes } from "./api/updates/updates.routes.js";
import { errorHandler, notFoundHandler } from "./utils/error.middleware.js";
import { requestLogger } from "./middlewares/global.middlewares.js";
import { authRoutes } from "./api/auth/auth.routes.js";
import helmet from "helmet";

dns.setDefaultResultOrder("ipv4first");

db.connect();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Coge la petición y la transforma a JSON
app.use(express.json());

app.use(helmet());

// CORS. Decide quién pasa y quien no.
const allowedOrigins = [
    "https://mynomadconnect.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
    origin: (origin, callback) => {
        // Permite peticiones sin origin (ej. Postman) y las de la lista
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    },
    credentials: true
}));

// Middleware global
app.use(requestLogger)

// Crea la ruta /
app.get("/", (req: Request, res: Response) => {
    // console.log(process.env.MONGO_URI);
    return res.json({ message: "Servidor funcionando correctamente" });
});

app.use("/api/trips", tripRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/days", dayRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/updates", updateRoutes);
app.use("/api/notifications", notificationRoutes);


// Captura de rutas no encontradas
app.use(notFoundHandler);

// Manejador global de errores
app.use(errorHandler);


// Crea el servidor
if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
}

export default app;