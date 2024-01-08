import { Request } from "express";
import { TResponseJson } from "../types";
import jwt from "jsonwebtoken";
import { ErrorCatchMessage } from "../helpers/error.helper";
import {
	Agenda,
	AgendaItems,
	TAgenda,
	TAgendaItems,
} from "../Schemas/Agenda.schema";
import mongoose, { ClientSession } from "mongoose";
import { ObjectId } from "mongodb";

export type TAgendaRequestBody = {
	title: string;
	items: TAgendaItems[];
	agendaId: string;
};

class AgendaModel {
	request: Request;

	constructor(request: Request) {
		this.request = request;
	}

	async createUpdateDeleteAgendaItem(body: TAgendaRequestBody): Promise<TResponseJson> {
		const responseJson: TResponseJson = {
			message: "",
			error: false,
			data: {},
			status: 200,
		};
		const session: ClientSession = await mongoose.startSession();
		session.startTransaction();

		try {
			const { title, items, agendaId }: TAgendaRequestBody = body;
			let selectedAgendaId = agendaId;
			let isTransactionSuccess = false;

			if (!selectedAgendaId) {
				const newAgenda: TAgenda[] = await Agenda.create([{ title }], {
					session,
				});

				if (newAgenda) {
					selectedAgendaId = newAgenda[0]._id;
				}
			}
			const bulkOperations = [];
			if (selectedAgendaId) {
				for (const item of items) {
					const agendaItem: any = item;
					if (agendaItem?.isDeleted) {
						bulkOperations.push({
							deleteOne: {
								filter: { _id: new ObjectId(agendaItem._id) },
							},
						});
						delete agendaItem._id;
					} else if (agendaItem?._id) {
						const { _id, createdAt, updatedAt, ...otherItems } = agendaItem;
						bulkOperations.push({
							updateOne: {
								filter: { _id: new ObjectId(_id) },
								update: { $set: { ...otherItems } },
							},
						});
					} else {
						delete agendaItem._id;
						bulkOperations.push({
							insertOne: {
								document: { ...agendaItem, agendaId: selectedAgendaId },
							},
						});
					}
				}

				const newAgendaItems = await AgendaItems.bulkWrite(bulkOperations, {
					session,
				});
				if (
					newAgendaItems.insertedCount ||
					newAgendaItems.matchedCount ||
					newAgendaItems.modifiedCount ||
					newAgendaItems.deletedCount
				) {
					await session.commitTransaction();
					isTransactionSuccess = true;
				} else {
					responseJson.status = 400;
					responseJson.error = true;
					responseJson.message =
						"Can't create/edit/delete item for agenda, something went wrong, please refresh the page!";
				}
			} else {
				responseJson.status = 400;
				responseJson.error = true;
				responseJson.message =
					"Can't create new agenda title, something went wrong, please refresh the page!";
			}
			session.endSession();

			if (isTransactionSuccess) {
				const newAgendaItems = await this.getAgendaWithItems(selectedAgendaId);
				const { data } = newAgendaItems;

				responseJson.data = { isSuccess: true, data };
			}
		} catch (error) {
			ErrorCatchMessage(error, responseJson);
		}

		return responseJson;
	}

	async getAgendas(): Promise<TResponseJson> {
		const responseJson: TResponseJson = {
			message: "",
			error: false,
			data: {},
			status: 200,
		};
		try {
			const data = await Agenda.find({});

			if (data) {
				responseJson.data = data;
			} else {
				responseJson.status = 400;
				responseJson.error = true;
				responseJson.message =
					"Can't get the list of agenda(s), something went wrong, please refresh the page!";
			}
		} catch (error) {
			ErrorCatchMessage(error, responseJson);
		}

		return responseJson;
	}

	async getAgendaWithItems(agendaId: string): Promise<TResponseJson> {
		const responseJson: TResponseJson = {
			message: "",
			error: false,
			data: {},
			status: 200,
		};
		try {
			const data = await AgendaItems.find({ agendaId }).sort({order: 1});

			if (data) {
				responseJson.data = data;
			} else {
				responseJson.status = 400;
				responseJson.error = true;
				responseJson.message =
					"Can't get the list of agenda(s), something went wrong, please refresh the page!";
			}
		} catch (error) {
			ErrorCatchMessage(error, responseJson);
		}

		return responseJson;
	}
}

export default AgendaModel;
