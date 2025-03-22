import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "A user must have username"],
  },
  title: {
    type: String,
    required: true,
  },
  chatLogs: [
    {
      role: {
        type: String,
        enum: ["user", "bot"],
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("chat", chatSchema);
export default Chat;
