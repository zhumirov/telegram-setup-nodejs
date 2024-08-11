import { Telegraf } from "telegraf";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import { logError, logInfo } from "./utils/logger.js";
import { processMessage, processCallbackQuery } from "./handlers/index.js";
import blockCheckMiddleware from "./middlewares/blockCheck.js";
import messageCounterMiddleware from "./middlewares/messageCounter.js";
import messageConstructorMiddleware from "./middlewares/messageConstructor.js";
import loggerMiddleware from "./middlewares/logger.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

mongoose.connect('mongodb://localhost:27017/jobrotg')
    .then(() => {
        logInfo('Connected to MongoDB');
    })
    .catch(error => {
        logError('Error connecting to MongoDB: ' + error.message);
    });

bot.use(async (ctx, next) => {
    const chatId = String(ctx.chat.id);
    const user = await User.findOne({ chatId }) || new User({ chatId, scenario: "start" });
    ctx.state.user = user;

    await next();
});

bot.use(blockCheckMiddleware);
bot.use(messageCounterMiddleware);
bot.use(messageConstructorMiddleware);
bot.use(loggerMiddleware);

bot.on("message", async (ctx) => {
    await processMessage(ctx);
});

bot.on("callback_query", async (ctx) => {
    await processCallbackQuery(ctx);
});

export default bot;