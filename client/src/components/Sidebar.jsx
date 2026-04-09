import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Search, Users, X } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await axiosInstance.get(`/messages/search/${searchQuery.trim()}`);
            setSearchResult(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "User not found");
            setSearchResult(null);
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResult(null);
    };

    const handleSelectSearchResult = (user) => {
        setSelectedUser(user);
        clearSearch();
    };

    const filteredUsers = showOnlineOnly
        ? users.filter((user) => onlineUsers.includes(user._id))
        : users;

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            {/* Header */}
            <div className="border-b border-base-300 w-full p-3 lg:p-5">
                <div className="hidden lg:flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium">Contacts</span>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mt-3 hidden lg:flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by ID (e.g. USR-A3F9B2)"
                            className="input input-bordered input-sm w-full pr-8 text-xs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                <X className="size-3.5 text-base-content/50" />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-sm btn-square btn-primary"
                        disabled={isSearching}
                    >
                        <Search className="size-4" />
                    </button>
                </form>

                {/* Online filter toggle */}
                <div className="mt-3 hidden lg:flex items-center justify-between">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">
                        ({onlineUsers.length - 1} online)
                    </span>
                </div>
            </div>

            {/* Search Result */}
            {searchResult && (
                <div className="p-2 border-b border-base-300 bg-base-200/50">
                    <p className="text-xs text-base-content/50 px-2 mb-1 hidden lg:block">Search Result</p>
                    <button
                        onClick={() => handleSelectSearchResult(searchResult)}
                        className="w-full p-2 flex items-center gap-3 hover:bg-base-300 rounded-lg transition-colors"
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={searchResult.profilePic || "/avatar.png"}
                                alt={searchResult.username}
                                className="size-10 object-cover rounded-full"
                            />
                            {onlineUsers.includes(searchResult._id) && (
                                <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-base-100" />
                            )}
                        </div>
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium text-sm truncate">{searchResult.username}</div>
                            <div className="text-xs text-primary">{searchResult.uniqueId}</div>
                        </div>
                    </button>
                </div>
            )}

            {/* User List */}
            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img src={user.profilePic || "/avatar.png"} alt={user.username} className="size-12 object-cover rounded-full" />
                            {onlineUsers.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                            )}
                        </div>

                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.username}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4 hidden lg:block">
                        No {showOnlineOnly ? "online " : ""}users found
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;