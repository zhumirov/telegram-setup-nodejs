import { logInfo } from "../utils/logger.js";

const loggerMiddleware = async (ctx, next) => {
    logInfo(`Received a message: ${JSON.stringify(ctx.message)}`);
    await next();
    logInfo(`Processed message for user ${ctx.state.user.chatId}: ${JSON.stringify(ctx.state.message)}`);
};

export default loggerMiddleware;