import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const { _id: senderId } = req.user;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error - Check Console" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({
        error: "Internal Server Error while getting messages - Check Console",
      });
  }
};
