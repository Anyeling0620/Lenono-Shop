import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfoStore {
    readonly userId: string;
    readonly avatar: string;
    readonly nikeName: string;
    readonly memberType: string;
    readonly messageCount: number;
    readonly notificationCount: number;
    readonly email: string,

    uploadAvatar: (avatar: string) => void;
    updateNikeName: (nikeName: string) => void;
    updateMemberType: (memberType: string) => void;

    updateMessageCount: (value: number | ((prev: number) => number)) => void;
    updateNotificationCount: (value: number | ((prev: number) => number)) => void;

    setUserInfo: (data: {
        userId: string;
        avatar: string;
        nikeName: string;
        memberType: string;
    }) => void;

    setEmail: (email: string) => void;
    setMessageCount: (messageCount: number) => void;
    setNotificationCount: (notificationCount: number) => void;

    clearUserInfo: () => void;
}

const useUserInfoStore = create<UserInfoStore>()(
    persist(
        (set) => ({
            userId: "",
            avatar: "default.png",
            nikeName: "哈吉米",
            memberType: "普通会员",
            couponsCount: 0,
            messageCount: 0,
            notificationCount: 0,
            email: '',

            uploadAvatar: (avatar: string) => set({ avatar }),
            updateNikeName: (nikeName: string) => set({ nikeName }),
            updateMemberType: (memberType: string) => set({ memberType }),

          

            updateMessageCount: (value) =>
                set((state) => ({
                    messageCount:
                        typeof value === "function"
                            ? value(state.messageCount)
                            : value,
                })),

            updateNotificationCount: (value) =>
                set((state) => ({
                    notificationCount:
                        typeof value === "function"
                            ? value(state.notificationCount)
                            : value,
                })),

            setUserInfo: ({ userId, avatar, nikeName, memberType }) =>
                set({ userId, avatar, nikeName, memberType }),

            setEmail: (email: string) => set({ email }),
            setMessageCount: (messageCount: number) => set({ messageCount }),
            setNotificationCount: (notificationCount: number) => set({ notificationCount }),

            clearUserInfo: () =>
                set({
                    userId: "",
                    avatar: "default.png",
                    nikeName: "",
                    memberType: "普通会员",
                    messageCount: 0,
                    notificationCount: 0,
                    email: ''
                }),
        }),
        {
            name: "user-info-storage", 
            partialize: (state) => ({
                userId: state.userId,
                avatar: state.avatar,
                nikeName: state.nikeName,
                memberType: state.memberType,
                messageCount: state.messageCount,
                notificationCount: state.notificationCount,
                email: state.email,
            }),
        }
    ));
export default useUserInfoStore;
