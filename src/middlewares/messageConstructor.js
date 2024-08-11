import Message from "../models/Message.js";
import { logInfo } from "../utils/logger.js";

const determineMessageType = (ctxMessage) => {
    if (ctxMessage.text) return 'text';
    if (ctxMessage.photo) return 'photo';
    if (ctxMessage.video) return 'video';
    if (ctxMessage.audio) return 'audio';
    if (ctxMessage.sticker) return 'sticker';
    if (ctxMessage.document) {
        if (ctxMessage.document.mime_type.includes('application/pdf')) return 'pdf';
        if (ctxMessage.document.mime_type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'docx';
        return 'document';
    }
    if (ctxMessage.voice) return 'voice';
    if (ctxMessage.animation) return 'animation'; // or consider video based on context
    if (ctxMessage.location) return 'location';
    return 'unknown';
};

const messageConstructorMiddleware = async (ctx, next) => {
    const user = ctx.state.user;
    const chatId = user.chatId;
    const messageType = determineMessageType(ctx.message);
    const content = ctx.message?.text || ctx.message?.caption || '';
    const messageId = ctx.message?.message_id || null;
    const date = ctx.message?.date || Date.now();
    const fileSize = ctx.message?.photo?.[ctx.message?.photo.length - 1]?.file_size || 
                     ctx.message?.video?.file_size ||
                     ctx.message?.audio?.file_size ||
                     ctx.message?.document?.file_size ||
                     ctx.message?.voice?.file_size ||
                     ctx.message?.animation?.file_size || null;

    const message = new Message(chatId, messageType, messageId, content, date);
    message.fileSize = fileSize;
    ctx.state.message = message;

    logInfo(`Constructed message for ${chatId}: ${JSON.stringify(message)}`);
    await next();
};

export default messageConstructorMiddleware;