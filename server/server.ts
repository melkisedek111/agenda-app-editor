import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import agendaRouter from "./routes/Agenda.routes";
import connectDB from "./config/database";

dotenv.config();
connectDB();
const app = express();
const PORT = 4000;

app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/agenda", agendaRouter);

const server = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
