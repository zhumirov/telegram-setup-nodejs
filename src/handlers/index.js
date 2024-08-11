import handleStart from "./start.js";
import handleRegular from "./regular.js";
import handleStartCommand from "./commands/start.js";

const scenarioHandlers = {
    start: handleStart,
    regular: handleRegular
};

const commandHandlers = {
    start: handleStartCommand,
};

const getScenarioHandler = (scenario) => {
    return scenarioHandlers[scenario] || scenarioHandlers['regular'];
};

const getCommandHandler = (command) => {
    return commandHandlers[command] || null;
};

const processMessage = async (ctx) => {
    const user = ctx.state.user;
    const message = ctx.state.message;

    if (message.type === 'text' && message.content.length > 2000) {
        await ctx.reply("Your message is too long.");
        return;
    }

    if (message.type === 'text' && message.content.startsWith("/")) {
        // This is a command
        const command = message.content.slice(1).split(' ')[0]; // Extract command name
        const commandHandler = getCommandHandler(command);
        if (commandHandler) {
            user.scenario = "regular"; // Set user's scenario to 'regular' if user is found and it's a command
            await user.save();
            await commandHandler(ctx, user, message);
            return;
        }
    }

    const scenarioHandler = getScenarioHandler(user.scenario);
    await scenarioHandler(ctx, user, message);
};

const processCallbackQuery = async (ctx) => {
    const user = ctx.state.user;
    const message = ctx.state.message;

    const scenarioHandler = getScenarioHandler(user.scenario);
    await scenarioHandler(ctx, user, message);
};

export { processMessage, processCallbackQuery };