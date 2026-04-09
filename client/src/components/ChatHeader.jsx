import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
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
                <div className="flex items-center gap-2">
                    <button
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to clear the ENTIRE chat for both of you?")) {
                                const { clearChat } = useChatStore.getState();
                                await clearChat();
                            }
                        }}
                        className="btn btn-error btn-xs btn-outline"
                    >
                        Clear Chat
                    </button>
                    <button onClick={() => setSelectedUser(null)} className="btn btn-ghost btn-circle btn-sm">
                        <X />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ChatHeader;
