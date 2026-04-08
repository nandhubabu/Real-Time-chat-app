import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, LogOut } from "lucide-react";

const Navbar = () => {
    const { authUser, logout } = useAuthStore();

    return (
        <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors cursor-pointer">
                        <MessageSquare className="size-6 text-primary" />
                        <div>Real-Time Chat</div>
                    </div>
                    {authUser && (
                        <button onClick={logout} className="btn btn-sm btn-ghost gap-2">
                            <LogOut className="size-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
