const handleStart = async (ctx, user, message) => {
    const responseMessage = `Your scenario is 'start' and user info is ${JSON.stringify(user)}, your message is ${JSON.stringify(message)}`;
    await ctx.reply(responseMessage);
    // Implement additional 'start' scenario logic here if needed
};

export default handleStart;