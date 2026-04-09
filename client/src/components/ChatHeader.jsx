import { X, MoreVertical, SquareCheck, Trash2, Ban } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = ({ onSelect, onDeleteAll }) => {
    const { selectedUser, setSelectedUser } = useChatStore();

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.username} />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium">{selectedUser.username}</h3>
                        <p className="text-sm text-base-content/70">Online</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
                            <MoreVertical className="size-5" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow-xl bg-base-100 rounded-box w-56 border border-base-300">
                            <li>
                                <a onClick={() => {
                                    document.activeElement.blur();
                                    if (onSelect) onSelect();
                                }} className="flex items-center gap-3 py-3">
                                    <SquareCheck className="size-4" /> Select Messages
                                </a>
                            </li>
                            <li>
                                <a onClick={() => {
                                    document.activeElement.blur();
                                    if (onDeleteAll) onDeleteAll();
                                }} className="flex items-center gap-3 py-3 text-error">
                                    <Trash2 className="size-4" /> Delete My Messages
                                </a>
                            </li>
                            <div className="divider my-0.5"></div>
                            <li>
                                <a onClick={async () => {
                                    document.activeElement.blur();
                                    if (window.confirm("Are you sure you want to clear the ENTIRE chat for both of you?")) {
                                        const { clearChat } = useChatStore.getState();
                                        await clearChat();
                                    }
                                }} className="flex items-center gap-3 py-3 text-error font-semibold">
                                    <Ban className="size-4" /> Clear Chat
                                </a>
                            </li>
                        </ul>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="btn btn-ghost btn-circle btn-sm">
                        <X className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ChatHeader;
