import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
    const { selectedUser } = useChatStore();

    return (
        <div className="h-screen bg-base-200 overflow-hidden">
            <div className="flex items-center justify-center pt-20 px-4 pb-4 h-full">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-full lg:h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        {/* Sidebar: hidden on mobile if a user is selected */}
                        <div className={`h-full ${selectedUser ? "hidden lg:flex" : "flex"} w-full lg:w-72`}>
                            <Sidebar />
                        </div>

                        {/* Chat Container / NoChatSelected: hidden on mobile if NO user is selected */}
                        <div className={`flex-1 h-full ${!selectedUser ? "hidden lg:flex" : "flex"}`}>
                            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;