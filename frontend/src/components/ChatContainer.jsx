import React, { useEffect, useRef } from 'react'
import {useChatStore} from "../store/useChatStore"
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"
import MessageSkeleton from "./MessageSkeleton"
import {useAuthStore} from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const{messages,getMessages,isMessagesLoading,selectedUser,subscribeToMessages,unsubscribeFromMessages} = useChatStore();
  const { authUser } = useAuthStore();
  // if(messages.length>0){
  //   console.log("messages format",messages[0]);
  // }
  console.log(messages);

  const messageEndRef = useRef(null);
  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({behavior: "smooth"});
    }
  },[messages])
  
  useEffect(()=>{
    getMessages(selectedUser.handle);
    subscribeToMessages();
    return ()=>unsubscribeFromMessages();
  },[selectedUser,getMessages,subscribeToMessages,unsubscribeFromMessages]);


  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderHandle === authUser.handle ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderHandle === authUser.handle
                      ? authUser.ProfilePic || "/avatar.png"
                      : selectedUser.ProfilePic || "/avatar.png"
                  }
                  alt="Profile Pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.sentAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        </div>
      <MessageInput/>
      </div>
  )
}

export default ChatContainer
