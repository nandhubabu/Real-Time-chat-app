import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck } from "lucide-react";

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages,
        markAsRead,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
            subscribeToMessages();
            // Mark the selected user's messages as read when we open the chat
            markAsRead(selectedUser._id);
        }
        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, markAsRead]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-base-100 overflow-hidden">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                    const isFromMe = message.senderId === authUser._id;
                    const profilePic = isFromMe ? authUser.profilePic : selectedUser.profilePic;

                    return (
                        <div
                            key={message._id}
                            className={`chat ${isFromMe ? "chat-end" : "chat-start"}`}
                        >
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border border-base-300">
                                    <img
                                        src={profilePic || "/avatar.png"}
                                        alt="profile pic"
                                    />
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">
                                    {formatMessageTime(message.createdAt)}
                                </time>
                            </div>
                            <div
                                className={`chat-bubble flex flex-col 
                                ${isFromMe ? "chat-bubble-primary text-primary-content" : "bg-base-200 text-base-content"}`}
                            >
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2 object-cover"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>

                            {/* Read Receipt — only show on MY messages */}
                            {isFromMe && (
                                <div className="chat-footer mt-0.5">
                                    {message.isRead ? (
                                        <span className="flex items-center gap-0.5 text-xs text-primary" title="Seen">
                                            <CheckCheck className="size-3.5" />
                                            <span className="opacity-70">Seen</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-0.5 text-xs opacity-40" title="Sent">
                                            <Check className="size-3.5" />
                                            <span>Sent</span>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messageEndRef} />
            </div>

            <MessageInput />
        </div>
    );
};
export default ChatContainer;
