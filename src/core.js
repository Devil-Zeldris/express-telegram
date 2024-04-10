import express from 'express';
import { Bot, HttpError, GrammyError } from 'grammy';
import { submitValidation } from './validation/telegram-submit.js';
import 'dotenv/config';

const { BOT_TOKEN, SERVER_PORT, CHAT_ID } = process.env;
const app = express();
const bot = new Bot(BOT_TOKEN);

app.use(express.json());

app.route('/telegram-submit').get(async (request, response) => {

    const { error } = submitValidation(request.body);

    if (error) return response.status(400).json({ error_messages: error.details.map(err => err.message) });

    const { first_name, phone } = request.body;

    await bot.api.sendMessage(Number(CHAT_ID), `<b>Имя:</b> ${first_name}\n<b>Номер телефона:</b> ${phone}`, { parse_mode: 'HTML' });

    return response.status(200).send(request.body);
});

app.listen(Number(SERVER_PORT), () => console.log(`[EXPRESS]`, `Started on port: ${SERVER_PORT}`));
bot.catch(err => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) console.error("Error in request:", e.description);
    if (e instanceof HttpError) console.error("Could not contact Telegram:", e);
    console.error("Unknown error:", e);
});
bot.start();