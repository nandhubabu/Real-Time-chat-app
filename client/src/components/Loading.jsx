import { MessageCircleMore } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-base-100 gap-4">
            <div className="relative">
                {/* Branded Logo with Pulse */}
                <MessageCircleMore className="size-16 text-primary animate-pulse" />

                {/* Secondary Spinner for dynamic feel */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="loading loading-spinner loading-lg text-primary/30 scale-150"></div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-1">
                <h2 className="text-xl font-bold tracking-tight text-base-content/80">Echo</h2>
                <span className="loading loading-dots loading-md text-primary"></span>
            </div>
        </div>
    );
};

export default Loading;
