const handleRegular = async (ctx, user, message) => {
    const responseMessage = `Your scenario is 'regular' and user info is ${JSON.stringify(user)}, your message is ${JSON.stringify(message)}`;
    await ctx.reply(responseMessage);
    // Implement additional 'regular' scenario logic here if needed
};

export default handleRegular;