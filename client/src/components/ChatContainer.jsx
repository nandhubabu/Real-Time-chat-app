import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSettingsStore } from "../store/useSettingsStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck, Trash2, Pencil, X, SquareCheck } from "lucide-react";
import toast from "react-hot-toast";

const ChatContainer = () => {
    const {
        messages, getMessages, isMessagesLoading,
        selectedUser, subscribeToMessages, unsubscribeFromMessages,
        markAsRead, deleteMessage, deleteSelectedMessages, deleteAllMessages, editMessage,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const { showTimestamps, fontSize, showReadReceipts } = useSettingsStore();
    const messageEndRef = useRef(null);

    // Context menu state
    const [contextMenu, setContextMenu] = useState(null); // { x, y, messageId, isFromMe, text }

    // Multi-select state
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
            subscribeToMessages();
            markAsRead(selectedUser._id);
        }
        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, markAsRead]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Close context menu on click anywhere else
    useEffect(() => {
        const close = () => setContextMenu(null);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);

    const handleRightClick = (e, message) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            message,
        });
    };

    const handleDeleteOne = async () => {
        await deleteMessage(contextMenu.message._id);
        setContextMenu(null);
    };

    const handleEditStart = () => {
        setEditingId(contextMenu.message._id);
        setEditText(contextMenu.message.text || "");
        setContextMenu(null);
    };

    const handleEditSave = async (messageId) => {
        if (!editText.trim()) return;
        await editMessage(messageId, editText);
        setEditingId(null);
    };

    const toggleSelectMessage = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return;
        await deleteSelectedMessages(Array.from(selectedIds));
        setSelectedIds(new Set());
        setSelectMode(false);
    };

    const handleDeleteAll = async () => {
        if (!confirm("Delete all your messages in this chat?")) return;
        await deleteAllMessages();
    };

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-base-100 overflow-hidden" onClick={() => setContextMenu(null)}>
            <ChatHeader />

            {/* Multi-select Toolbar */}
            {selectMode && (
                <div className="flex items-center gap-2 px-4 py-2 bg-base-200 border-b border-base-300 text-sm">
                    <span>{selectedIds.size} selected</span>
                    <button
                        className="btn btn-sm btn-error gap-1 ml-auto"
                        disabled={selectedIds.size === 0}
                        onClick={handleDeleteSelected}
                    >
                        <Trash2 className="size-3.5" /> Delete selected
                    </button>
                    <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => { setSelectMode(false); setSelectedIds(new Set()); }}
                    >
                        <X className="size-4" /> Cancel
                    </button>
                </div>
            )}

            {/* Action Bar */}
            {!selectMode && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-base-100 border-b border-base-300 text-xs">
                    <button
                        className="btn btn-xs btn-ghost gap-1 ml-auto opacity-60 hover:opacity-100"
                        onClick={() => setSelectMode(true)}
                    >
                        <SquareCheck className="size-3.5" /> Select
                    </button>
                    <button
                        className="btn btn-xs btn-ghost gap-1 text-error opacity-60 hover:opacity-100"
                        onClick={handleDeleteAll}
                    >
                        <Trash2 className="size-3.5" /> Delete all my messages
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                    const isFromMe = message.senderId === authUser._id;
                    const profilePic = isFromMe ? authUser.profilePic : selectedUser.profilePic;
                    const isSelected = selectedIds.has(message._id);
                    const isEditing = editingId === message._id;

                    return (
                        <div
                            key={message._id}
                            className={`chat ${isFromMe ? "chat-end" : "chat-start"} relative`}
                            onContextMenu={(e) => isFromMe && !message.isDeleted && handleRightClick(e, message)}
                            onClick={() => selectMode && isFromMe && toggleSelectMessage(message._id)}
                        >
                            {/* Checkbox in select mode */}
                            {selectMode && isFromMe && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm checkbox-primary"
                                        checked={isSelected}
                                        onChange={() => toggleSelectMessage(message._id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}

                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border border-base-300">
                                    <img src={profilePic || "/avatar.png"} alt="profile pic" />
                                </div>
                            </div>

                            {showTimestamps && (
                                <div className="chat-header mb-1">
                                    <time className="text-xs opacity-50 ml-1">
                                        {formatMessageTime(message.createdAt)}
                                    </time>
                                </div>
                            )}

                            {/* Deleted message placeholder */}
                            {message.isDeleted ? (
                                <div className="chat-bubble bg-base-200 text-base-content/40 italic text-sm flex items-center gap-1">
                                    <Trash2 className="size-3" /> This message was deleted
                                </div>
                            ) : isEditing ? (
                                // Inline edit input
                                <div className="flex items-center gap-2 max-w-xs">
                                    <input
                                        className="input input-sm input-bordered flex-1"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleEditSave(message._id);
                                            if (e.key === "Escape") setEditingId(null);
                                        }}
                                        autoFocus
                                    />
                                    <button className="btn btn-xs btn-success" onClick={() => handleEditSave(message._id)}>✓</button>
                                    <button className="btn btn-xs btn-ghost" onClick={() => setEditingId(null)}>✕</button>
                                </div>
                            ) : (
                                <div
                                    className={`chat-bubble flex flex-col 
                                    ${isFromMe ? "chat-bubble-primary text-primary-content" : "bg-base-200 text-base-content"}
                                    ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}
                                    ${fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base"}
                                    `}
                                >
                                    {message.image && (
                                        <img
                                            src={message.image}
                                            alt="Attachment"
                                            className="sm:max-w-[200px] rounded-md mb-2 object-cover"
                                        />
                                    )}
                                    {message.text && (
                                        <p>
                                            {message.text}
                                            {message.isEdited && (
                                                <span className="text-[10px] opacity-60 ml-1">(edited)</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Read receipt — icon only, no text */}
                            {showReadReceipts && isFromMe && !message.isDeleted && (
                                <div className="chat-footer mt-0.5">
                                    {message.isRead ? (
                                        <CheckCheck className="size-3.5 text-primary" title="Seen" />
                                    ) : (
                                        <Check className="size-3.5 opacity-40" title="Sent" />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messageEndRef} />
            </div>

            {/* Right-click Context Menu */}
            {contextMenu && (
                <div
                    className="fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-xl py-1 min-w-36"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {contextMenu.message.text && (
                        <button
                            className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-base-200"
                            onClick={handleEditStart}
                        >
                            <Pencil className="size-3.5" /> Edit
                        </button>
                    )}
                    <button
                        className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-base-200 text-error"
                        onClick={handleDeleteOne}
                    >
                        <Trash2 className="size-3.5" /> Delete
                    </button>
                </div>
            )}

            <MessageInput />
        </div>
    );
};
export default ChatContainer;
