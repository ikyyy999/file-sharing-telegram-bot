import * as dotenv from "dotenv";
dotenv.config();

export const botToken: any = process.env.BOT_TOKEN;
export const cyclicDBName = process.env.CYCLIC_DB_NAME;
export const FORCE_SUB_CHANNEL = process.env.FSUB_CHANNEL;
export const adminIDs = process.env.ADMIN_ID;
export const botID = process.env.BOT_ID;
export const telegramApiId = process.env.API_ID;
