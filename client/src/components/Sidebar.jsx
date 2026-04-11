import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Search, Users, X } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
        return matchesSearch && matchesOnline;
    });

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="flex h-full min-h-0 w-full flex-col border-r border-base-300 transition-all duration-200 lg:w-80">
            {/* Header */}
            <div className="w-full shrink-0 border-b border-base-300 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Users className="size-5" />
                    <span className="font-semibold">Contacts</span>
                </div>

                {/* Search Bar — Local Name Filter */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="input input-bordered input-sm w-full pl-9 pr-8 text-xs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                <X className="size-3.5 text-base-content/50" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Online filter toggle */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-xs"
                        />
                        <span className="text-xs">Online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">
                        {Math.max(0, onlineUsers.length - 1)} online
                    </span>
                </div>
            </div>

            {/* User List */}
            <div className="min-h-0 flex-1 overflow-y-auto py-3 scrollbar-hide">
                {filteredUsers.length === 0 ? (
                    <div className="text-center text-zinc-500 py-8 px-4 flex flex-col items-center gap-2">
                        <Search className="size-8 opacity-40" />
                        <p className="text-sm">No conversations yet.</p>
                        <p className="text-xs opacity-60">Wait for new messages or add a contact by ID in settings!</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`flex w-full min-w-0 items-center gap-3 p-3 transition-colors hover:bg-base-300
                                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                            `}
                        >
                            <div className="relative">
                                <img
                                    src={user.profilePic || "/avatar.png"}
                                    alt={user.username}
                                    className="size-11 object-cover rounded-full"
                                    onError={(e) => { e.target.src = "https://avatar.iran.liara.run/public"; }}
                                />
                                {onlineUsers.includes(user._id) && (
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                                )}
                            </div>
                            <div className="text-left min-w-0 flex-1">
                                <div className="font-medium truncate">{user.username}</div>
                                <div className="text-sm text-zinc-400">
                                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                </div>
                            </div>
                            {user.unreadCount > 0 && (
                                <div className="badge badge-primary badge-sm">
                                    {user.unreadCount}
                                </div>
                            )}
                        </button>
                    ))
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
