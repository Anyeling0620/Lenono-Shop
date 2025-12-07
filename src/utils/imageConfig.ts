export const IMAGE_CONFIG = {
    PUBLIC_URL: import.meta.env.VITE_PUBLIC_URL,
    SERVER_PUBLIC_URL: import.meta.env.VITE_SERVER_PUBLIC_URL,

    FOLDERS: {
        ROLL: import.meta.env.VITE_ROLL_FOLDER,
        USER_AVATAR: import.meta.env.VITE_USER_AVATAR_FOLDER, // 用户头像
        // ......
    }
} as const;


export const getImageUrl = (
    imageName: string,
    folder: string
): string => {
    const baseUrl = IMAGE_CONFIG.PUBLIC_URL;

    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanFolder = folder.startsWith('/') ? folder.slice(1) : folder;
    const cleanImage = imageName.startsWith('/') ? imageName.slice(1) : imageName;

    return `${cleanBase}/${cleanFolder}/${cleanImage}`;
}

export const getUserAvatarUrl = (
    imageName: string | null ,
): string => {
    const finalImageName = imageName || 'default.png';
    return `${IMAGE_CONFIG.SERVER_PUBLIC_URL}/${IMAGE_CONFIG.FOLDERS.USER_AVATAR}/${finalImageName}`
}
