import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    
    // Get all users except current user
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    const unseenMessages = {};
    
    // Get last message time for each user and unseen count
    const usersWithLastMessage = await Promise.all(
      filteredUsers.map(async (user) => {
        // Get unseen messages count
        const unseenCount = await Message.countDocuments({
          senderId: user._id, 
          receiverId: loggedInUserId, 
          seen: false
        });
        
        if (unseenCount > 0) {
          unseenMessages[user._id] = unseenCount;
        }

        // Get last message time between current user and this user
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId }
          ]
        }).sort({ createdAt: -1 });

        return {
          ...user.toObject(),
          lastMessageTime: lastMessage ? lastMessage.createdAt : user.createdAt
        };
      })
    );

    // Sort users by last message time (most recent first)
    const sortedUsers = usersWithLastMessage.sort((a, b) => 
      new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    res.status(200).json({
      success: true,
      users: sortedUsers,
      unseenMessages: unseenMessages
    });
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Get all messages for selected user
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });
        await Message.updateMany({ senderId: userToChatId, receiverId: myId }, { seen: true });

        res.status(200).json({
            success: true,
            messages: messages
        });
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//Send message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Validate that at least text or image is provided
    if (!text && !image) {
      return res.status(400).json({ success: false, message: "Message must contain either text or image" });
    }

    // Validate receiverId format
    if (!receiverId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid receiver ID format" });
    }

    let imageUrl;
    if (image) {
      try {
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to upload image" 
        });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      seen: false,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      success: true,
      newMessage: newMessage
    });
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Mark message as seen
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true })
        res.json({ success: true })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//Delete message
export const deleteMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.json({ success: false, message: "Message not found" });
        }

        if (message.senderId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Unauthorized to delete this message" });
        }

        message.isDeleted = true;
        await message.save();

        const receiverSocketId = getReceiverSocketId(message.receiverId);
        const senderSocketId = getReceiverSocketId(userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message-deleted", { messageId, isDeleted: true });
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("message-deleted", { messageId, isDeleted: true });
        }

        res.json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};