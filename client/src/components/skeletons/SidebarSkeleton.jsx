const SidebarSkeleton = () => {
    return (
        <aside className="flex h-full w-full flex-col border-r border-base-300 transition-all duration-200 lg:w-80">
            <div className="overflow-y-auto w-full py-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-full p-3 flex items-center gap-3">
                        <div className="skeleton size-12 rounded-full shrink-0"></div>
                        <div className="hidden lg:block flex-1">
                            <div className="skeleton h-4 w-32 mb-2"></div>
                            <div className="skeleton h-3 w-16"></div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};
export default SidebarSkeleton;
