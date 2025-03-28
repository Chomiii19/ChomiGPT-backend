import axios from "axios";
import Chat from "../models/chatModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import generateResponse from "./chatbotController";

const newChat = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return res
      .status(400)
      .json({ status: "Fail", message: "Message is required" });
  }

  if (req.user) {
    const chat = await Chat.create({
      username: req.user.username,
      title: message,
      chatLogs: [
        {
          role: "user",
          message,
        },
      ],
    });

    if (chat.chatLogs.length > 0) {
      chat.chatLogs.shift();
      await chat.save();
    }

    return res.status(201).json({ status: "Success", data: chat });
  } else {
    return res
      .status(200)
      .json({ status: "Success", data: { role: "user", message } });
  }
});

const getAllChats = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User not logged in", 403));

  const chats = await Chat.find({ username: req.user.username })
    .select("title createdAt _id")
    .sort({ createdAt: -1 });

  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const groupedChats: {
    today: typeof chats;
    thisMonth: typeof chats;
    older: typeof chats;
  } = {
    today: [],
    thisMonth: [],
    older: [],
  };

  chats.forEach((chat) => {
    const chatDate = new Date(chat.createdAt);

    if (chatDate >= startOfToday) {
      groupedChats.today.push(chat);
    } else if (chatDate >= startOfMonth) {
      groupedChats.thisMonth.push(chat);
    } else {
      groupedChats.older.push(chat);
    }
  });

  res.status(200).json({ status: "Success", data: groupedChats });
});

const getChat = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User not logged in", 403));

  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new AppError("Chat does not exist", 404));

  res.status(200).json({ status: "Success", data: chat });
});

const continueChat = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;
  const { message } = req.body;

  const botResponse = await generateResponse(message);

  if (req.user) {
    const chat = await Chat.findById(chatId);

    if (!chat) return next(new AppError("Chat does not exist", 404));

    chat.chatLogs.push(
      { role: "user", message },
      { role: "bot", message: botResponse }
    );

    await chat.save();

    return res.status(200).json({ data: { response: botResponse } });
  } else {
    res.status(200).json({ data: { response: botResponse } });
  }
});

export { newChat, getAllChats, getChat, continueChat };
