export const IMAGE_CONFIG = {
    SERVER_PUBLIC_URL: import.meta.env.VITE_SERVER_PUBLIC_URL,

    FOLDERS: {
        ROLL: import.meta.env.VITE_ROLL_FOLDER,
        USER_AVATAR: import.meta.env.VITE_USER_AVATAR_FOLDER || 'static/images/user/avatar', // 用户头像
        IMAGES: import.meta.env.VITE_IMAGES_FOLDER,
    }
} as const;


export const getUserAvatarUrl = (
    imageName: string | null | undefined,
): string => {
    const finalImageName = imageName || 'default.png';
    return `${IMAGE_CONFIG.SERVER_PUBLIC_URL}/${IMAGE_CONFIG.FOLDERS.USER_AVATAR}/${finalImageName}`
}

export const getImageUrl = (
    image: string | null | undefined
): string => {
    if (!image) image = 'default.png'

    if (image.startsWith('https://'))
        return `${image}`

    return `${IMAGE_CONFIG.SERVER_PUBLIC_URL}/${IMAGE_CONFIG.FOLDERS.IMAGES}/${image}`
}