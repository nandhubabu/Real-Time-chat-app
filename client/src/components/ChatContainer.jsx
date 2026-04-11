import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSettingsStore } from "../store/useSettingsStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime, getAvatarUrl, getDisplayName, handleAvatarError } from "../lib/utils";
import { Check, CheckCheck, Trash2, Pencil, X } from "lucide-react";

const ChatContainer = () => {
    const {
        messages, getMessages, isMessagesLoading,
        selectedUser,
        markAsRead, deleteMessage, deleteSelectedMessages, deleteAllMessages, editMessage,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const { showTimestamps, fontSize, showReadReceipts } = useSettingsStore();
    const messageEndRef = useRef(null);
    const selectedDisplayName = getDisplayName(selectedUser);
    const authDisplayName = getDisplayName(authUser);

    // Context menu state
    const [contextMenu, setContextMenu] = useState(null); // { x, y, messageId, isFromMe, text }

    // Multi-select state
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        if (!selectedUser) return;

        getMessages(selectedUser._id);
        markAsRead(selectedUser._id);
    }, [selectedUser, getMessages, markAsRead]);

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
        <div className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden bg-base-100" onClick={() => setContextMenu(null)}>
            <div className="flex-none bg-base-100/90 backdrop-blur-sm z-10 border-b border-base-300">
                <ChatHeader onSelect={() => setSelectMode(true)} onDeleteAll={handleDeleteAll} />
            </div>

            {/* Multi-select Toolbar */}
            {selectMode && (
                <div className="z-10 flex flex-none flex-wrap items-center gap-2 border-b border-base-300 bg-base-200 px-3 py-2 text-sm sm:px-4">
                    <span className="w-full text-sm font-medium sm:w-auto">{selectedIds.size} selected</span>
                    <button
                        className="btn btn-sm btn-error gap-1 w-full sm:ml-auto sm:w-auto"
                        disabled={selectedIds.size === 0}
                        onClick={handleDeleteSelected}
                    >
                        <Trash2 className="size-3.5" /> Delete selected
                    </button>
                    <button
                        className="btn btn-sm btn-ghost w-full sm:w-auto"
                        onClick={() => { setSelectMode(false); setSelectedIds(new Set()); }}
                    >
                        <X className="size-4" /> Cancel
                    </button>
                </div>
            )}

            <div className="min-h-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto p-3 scrollbar-hide sm:space-y-4 sm:p-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {messages.map((message) => {
                    const isFromMe = message.senderId === authUser._id;
                    const profilePic = isFromMe ? getAvatarUrl(authUser) : getAvatarUrl(selectedUser);
                    const avatarAlt = isFromMe ? authDisplayName : selectedDisplayName;
                    const isSelected = selectedIds.has(message._id);
                    const isEditing = editingId === message._id;

                    return (
                        <div
                            key={message._id}
                            className={`chat relative w-full ${isFromMe ? "chat-end" : "chat-start"} ${selectMode && isFromMe ? "pl-6 sm:pl-7" : ""}`}
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
                                <div className="size-8 rounded-full border border-base-300 sm:size-10">
                                    <img src={profilePic} alt={avatarAlt} onError={handleAvatarError} />
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
                                <div className="chat-bubble flex max-w-[min(82vw,20rem)] items-center gap-1 bg-base-200 text-sm italic text-base-content/40 sm:max-w-[70%]">
                                    <Trash2 className="size-3" /> This message was deleted
                                </div>
                            ) : isEditing ? (
                                // Inline edit input
                                <div className="flex w-full max-w-[min(18rem,70vw)] items-center gap-2 sm:max-w-xs">
                                    <input
                                        className="input input-sm input-bordered min-w-0 flex-1"
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
                                    className={`chat-bubble flex max-w-[min(82vw,22rem)] flex-col break-words sm:max-w-[75%]
                                    ${isFromMe ? "chat-bubble-primary text-primary-content" : "bg-base-200 text-base-content"}
                                    ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}
                                    ${fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base"}
                                    `}
                                >
                                    {message.image && (
                                        <img
                                            src={message.image}
                                            alt="Attachment"
                                            className="mb-2 w-full max-w-[min(16rem,68vw)] rounded-md object-cover sm:max-w-[200px]"
                                            onError={(e) => { e.target.style.display = 'none'; }}
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

            <div className="z-10 flex-none border-t border-base-300 bg-base-100 p-2 sm:p-3">
                <MessageInput />
            </div>
        </div>
    );
};
export default ChatContainer;
