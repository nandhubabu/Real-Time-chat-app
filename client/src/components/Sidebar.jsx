import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="overflow-y-auto w-full py-3">
                {users.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img src={user.profilePic || "/avatar.png"} alt={user.name} className="size-12 object-cover rounded-full" />
                        </div>

                        {/* Only show name on larger screens (Industry standard Responsive Design) */}
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.username}</div>
                            <div className="text-sm text-zinc-400">Offline</div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;