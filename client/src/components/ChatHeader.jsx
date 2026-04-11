import { X, MoreVertical, SquareCheck, Trash2, Ban, ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = ({ onSelect, onDeleteAll }) => {
    const { selectedUser, setSelectedUser } = useChatStore();

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex min-w-0 items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    {/* Back button for mobile */}
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="btn btn-ghost btn-circle btn-sm lg:hidden"
                    >
                        <ArrowLeft className="size-5" />
                    </button>

                    <div className="avatar">
                        <div className="relative size-9 rounded-full sm:size-10">
                            <img
                                src={selectedUser.profilePic || "/avatar.png"}
                                alt={selectedUser.username}
                                onError={(e) => { e.target.src = "https://avatar.iran.liara.run/public"; }}
                            />
                        </div>
                    </div>
                    <div className="min-w-0">
                        <h3 className="truncate font-medium">{selectedUser.username}</h3>
                        <p className="truncate text-sm text-base-content/70">Online</p>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
                            <MoreVertical className="size-5" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[50] menu w-52 max-w-[calc(100vw-1rem)] rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
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
                    <button onClick={() => setSelectedUser(null)} className="btn btn-ghost btn-circle btn-sm hidden lg:inline-flex">
                        <X className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ChatHeader;
