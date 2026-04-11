export function formatMessageTime(dateString) {
    return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export const DEFAULT_AVATAR = "/avatar.svg";
const DEFAULT_DISPLAY_NAME = "New User";

export function getDisplayName(userOrName) {
    const rawName =
        typeof userOrName === "string"
            ? userOrName
            : userOrName?.username;

    if (typeof rawName !== "string") return DEFAULT_DISPLAY_NAME;

    const normalizedName = rawName.trim();
    return normalizedName || DEFAULT_DISPLAY_NAME;
}

export function getAvatarUrl(userOrUrl) {
    const rawAvatar =
        typeof userOrUrl === "string"
            ? userOrUrl
            : userOrUrl?.profilePic;

    if (typeof rawAvatar !== "string") return DEFAULT_AVATAR;

    const normalizedAvatar = rawAvatar.trim();
    return normalizedAvatar || DEFAULT_AVATAR;
}

export function handleAvatarError(event) {
    const img = event.currentTarget;
    if (!img || img.dataset.fallbackApplied === "true") return;

    img.dataset.fallbackApplied = "true";
    img.src = DEFAULT_AVATAR;
}
