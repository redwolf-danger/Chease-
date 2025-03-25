// import User from "../models/user.model.js";
// import Message from "../models/message.models.js";
import cloudinary from "../lib/cloudinary.lib.js";
import { getReceiverSocketId, io } from "../lib/socket.lib.js";
import { fetchUsers, get_conversation, save_message } from "../lib/db/FireStore.db.lib.js";

export const getUsersForSidebar = async(req, res) => {
    try {
        // const loggedInUserId = req.user._id;
        // console.log(req.user.handle);
        const contacts = await fetchUsers(req.user);
        // console.log("contacts is ", contacts);
        return res.status(200).json({ filteredUsers: contacts });
        // const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-Password");
        // modify only users which we have communicated with
        // res.status(200).json({
        //     filteredUsers
        // })

    } catch (error) {
        console.log('Error in getUsersForSidebar', error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getMessages = async(req, res) => {
    try {
        const { id: user2Handle } = req.params;
        const user_asking = req.user;
        const {
            handle: user1Handle
        } = user_asking;
        // console.log("error was in get_conversation fucntion");
        const messages = await get_conversation(user1Handle, user2Handle);
        // console.log("message", messages);
        res.status(200).json(messages)
    } catch (error) {
        console.log(error);
        console.log("Error in getMessages controller ", error.message)
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessage = async(req, res) => {
    console.log("inside send message controller");
    try {
        const { text, image } = req.body;
        console.log("text is ", text);
        console.log("image is ", image);
        const { id: receiverHandle } = req.params;
        const sender = req.user;
        console.log("sender is ", sender)
        const {
            handle: senderHandle
        } = sender;


        let imageUrl = "";
        if (image) {
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        };


        const newMessage = ({
            senderHandle,
            receiverHandle,
            text,
            image: imageUrl,
            sentAt: Date.now(),
            sent: true,
            admin: false,
        });


        // await newMessage.save()
        try {
            await save_message(newMessage);
        } catch (error) {
            console.log(error);
            newMessage.sent = false;
            return res.status(400).json(newMessage);
        }

        const receiverSocketId = getReceiverSocketId(receiverHandle);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller ", error.message)
        res.status(500).json({ message: "Internal Server Error" });
    }
}