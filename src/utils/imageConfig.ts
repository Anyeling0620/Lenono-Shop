export const IMAGE_CONFIG = {
    PUBLIC_URL: import.meta.env.VITE_PUBLIC_URL,

    FOLDERS: {
        ROLL: import.meta.env.VITE_ROLL_FOLDER,
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