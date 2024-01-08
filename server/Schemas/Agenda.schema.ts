import mongoose, { Document, Schema } from "mongoose";

export type TAgenda = Document & {
	title: string;
};

const AgendaSchema = new mongoose.Schema(
	{
		title: { type: String, unique: true },
	},
	{ timestamps: true }
);

export const Agenda = mongoose.model<TAgenda>("Agenda", AgendaSchema);

export type TAgendaItems = {
	_id?: string | mongoose.Types.ObjectId;
	agendaId?: mongoose.Types.ObjectId;
	order: number;
	phase: string;
	content: string;
	objectives: string;
	duration: number;
	creditable: boolean;
};

const AgendaItemsSchema = new mongoose.Schema<TAgendaItems>(
	{
		agendaId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Agenda",
		},
		order: Number,
		phase: String,
		content: String,
		objectives: String,
		duration: Number,
		creditable: Boolean,
	},
	{ timestamps: true }
);

export const AgendaItems = mongoose.model(
	"AgendaItems",
	AgendaItemsSchema
);
