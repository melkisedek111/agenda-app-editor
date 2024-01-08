import { Request, Response } from "express";
import { TResponseJson } from "../types";

export const ErrorCatchMessage = (
	error: any,
	json: TResponseJson
): void => {
	console.log(error);
	json.status = 500;
	json.message = "Server Error";
	json.error = true;
};


