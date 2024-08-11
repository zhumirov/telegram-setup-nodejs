import { logInfo } from "../utils/logger.js";

const blockCheckMiddleware = async (ctx, next) => {
    const user = ctx.state.user;

    if (user && user.blockedUntil && new Date() < new Date(user.blockedUntil)) {
        await ctx.reply(`Your account is blocked until ${user.blockedUntil}`);
        return;
    }

    logInfo(`User ${user.chatId} is not blocked.`);
    await next();
};

export default blockCheckMiddleware;