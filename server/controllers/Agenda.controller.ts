import { Request, Response } from "express";
import AgendaModel, { TAgendaRequestBody } from "../models/Agenda.model";

const createUpdateDeleteAgendaItem = async (request: Request, response: Response) => {
	try {
		const agendaModel = new AgendaModel(request);
		const agendaValues: TAgendaRequestBody = request.body;
		const createUpdateDeleteAgendaItem = await agendaModel.createUpdateDeleteAgendaItem(agendaValues);
		response.status(createUpdateDeleteAgendaItem.status).json(createUpdateDeleteAgendaItem);
	} catch (error) {
		response.status(500).json({ message: error, status: 500 });
	}
};

const getAgendas = async (request: Request, response: Response) => {
	try {
		const agendaModel = new AgendaModel(request);
		const agendas = await agendaModel.getAgendas();
		response.status(agendas.status).json(agendas);
	} catch (error) {
		response.status(500).json({ message: error, status: 500 });
	}
};

const getAgendaWithItems = async (request: Request, response: Response) => {
	try {
		const agendaModel = new AgendaModel(request);
		const agendas = await agendaModel.getAgendaWithItems(request.body.agendaId);
		response.status(agendas.status).json(agendas);
	} catch (error) {
		response.status(500).json({ message: error, status: 500 });
	}
};

export { createUpdateDeleteAgendaItem, getAgendas, getAgendaWithItems};
