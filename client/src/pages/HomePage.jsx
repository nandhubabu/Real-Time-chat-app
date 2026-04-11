import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
    const { selectedUser } = useChatStore();

    return (
        <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-base-200">
            <div className="h-16 flex-none" /> {/* Spacer for fixed Navbar */}
            <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-1 items-stretch justify-center lg:p-4">
                <div className="flex h-full min-h-0 w-full max-w-7xl overflow-hidden bg-base-100 lg:rounded-2xl lg:shadow-xl">
                    <div className="flex h-full min-h-0 w-full overflow-hidden">
                        {/* Sidebar: hidden on mobile if a user is selected */}
                        <div className={`h-full min-w-0 ${selectedUser ? "hidden lg:flex" : "flex"} w-full lg:w-80 lg:flex-none`}>
                            <Sidebar />
                        </div>

                        {/* ChatContainer: hidden on mobile if no user is selected */}
                        <div className={`h-full min-w-0 flex-1 ${!selectedUser ? "hidden lg:flex" : "flex"}`}>
                            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
