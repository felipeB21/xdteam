import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

dotenv.config();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
const corsOptions = {
  origin: ["http://localhost:3000", "https://api.tracker.gg"], // Cambia esto al origen de tu cliente
  credentials: true, // Habilitar las cookies en las solicitudes CORS
  optionsSuccessStatus: 200, // Para navegadores antiguos que dan problemas con status 204
};

app.use(cors(corsOptions));

import userRouter from "./routes/user.router.js";
import teamRouter from "./routes/team.router.js";

const api = "/api/v1";
app.use(`${api}/user`, userRouter);
app.use(`${api}/team`, teamRouter);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Server running in PORT: http://localhost:${PORT}`);
});
