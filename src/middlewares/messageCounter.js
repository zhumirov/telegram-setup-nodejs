import { logInfo } from "../utils/logger.js";

const messageCounterMiddleware = async (ctx, next) => {
    const user = ctx.state.user;
    const MESSAGE_LIMIT = parseInt(process.env.MESSAGE_LIMIT, 10);

    if (user) {
        const today = new Date();
        const lastMessageDate = new Date(user.messageCount.date);
      
        if (!lastMessageDate || lastMessageDate.toDateString() !== today.toDateString()) {
            user.messageCount.date = today;
            user.messageCount.count = 1;
        } else {
            user.messageCount.count += 1;
        }

        if (user.messageCount.count > MESSAGE_LIMIT) {
            await ctx.reply("You have exceeded the message limit for today");
            return;
        }

        await user.save();
    }

    logInfo(`User ${user.chatId} sent ${user.messageCount.count} messages today.`);
    await next();
};

export default messageCounterMiddleware;