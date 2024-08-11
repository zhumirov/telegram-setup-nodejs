export const logMessage = (type, message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
};

export const logError = (message) => {
    logMessage('error', message);
};

export const logInfo = (message) => {
    logMessage('info', message);
};