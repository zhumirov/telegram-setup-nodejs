import bot from "./bot.js";
import { logError, logInfo } from "./utils/logger.js";

bot.launch()
    .then(() => logInfo('Bot is up and running'))
    .catch(error => logError('Error in launching bot: ' + error.message));