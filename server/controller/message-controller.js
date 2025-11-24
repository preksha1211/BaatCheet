import Message from "../model/Message.js";
import Conversation from "../model/Conversation.js";

export const newMessages = async (request, response) => {
    
    try {
        const newMessages = new Message(request.body);

        await newMessages.save();
        await Conversation.findByIdAndUpdate(request.body.conversationId, { message:request.body.text});

        
        return response.status(200).json("Message has been sent successfully");
    } catch (error) {
        response.status(500).json(error.message);
    }

}

export const getMessages = async (request, response) => {
    try {
        const messages = await Message.find({ conversationId: request.params.id });
        return response.status(200).json(messages);
    } catch (error) {
        return response.status(500).json(error.message);
    }
}
