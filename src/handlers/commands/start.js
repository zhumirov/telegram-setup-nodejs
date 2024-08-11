const handleStartCommand = async (ctx, user, message) => {
    const responseMessage = `Command /start received. User info: ${JSON.stringify(user)}, Message: ${JSON.stringify(message)}`;
    await ctx.reply(responseMessage);
};

export default handleStartCommand;