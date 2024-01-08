import express, { Request, Response } from "express";
import { createUpdateDeleteAgendaItem, getAgendaWithItems, getAgendas } from "../controllers/Agenda.controller";

const agendaRouter = express.Router();
agendaRouter.post("/createUpdateDeleteAgendaItem", createUpdateDeleteAgendaItem);
agendaRouter.get("/get", getAgendas);
agendaRouter.post("/items", getAgendaWithItems);

export default agendaRouter;
