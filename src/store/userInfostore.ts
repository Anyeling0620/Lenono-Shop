import { create } from "zustand";

 interface  UserInfoStore {
    readonly avatar: string;
    readonly nikeName: string;
    readonly memberType : string;
    readonly couponsCount: number;
    readonly messageCount: number;

    uploadAvatar: (avatar: string) => void;
    updateNikeName: (nikeName: string) => void;
    updateMemberType: (memberType: string) => void;
    updateCouponsCount: (couponsCount: number) => void;
    updateMessageCount: (messageCount: number) => void;

    setUserInfo: ({avatar,nikeName,memberType}: {avatar: string; nikeName: string; memberType: string}) => void;
    setCouponsCount: (couponsCount: number) => void;
    setMessageCount: (messageCount: number) => void;

    clearUserInfo: () => void;
}

const useUserInfoStore = create<UserInfoStore>()((set) => ({
    avatar: "default.png",
    nikeName: "非登陆状态测试",
    memberType: "普通会员",
    couponsCount: 0,
    messageCount: 0,

    uploadAvatar: (avatar: string) => ({ avatar }),
    updateNikeName: (nikeName: string) => set({ nikeName }),
    updateMemberType: (memberType: string) => set({ memberType }),
    updateCouponsCount: (couponsCount: number) => set({ couponsCount }),
    updateMessageCount: (messageCount: number) => set({ messageCount }),

    setUserInfo: ({ avatar, nikeName, memberType }: { avatar: string; nikeName: string; memberType: string }) => set({ avatar, nikeName, memberType }),
    setCouponsCount: (couponsCount: number) => set({ couponsCount }),
    setMessageCount: (messageCount: number) => set({ messageCount }),

    clearUserInfo: () => set({
        avatar: "default.png",
        nikeName: "",
        memberType: "普通会员",
        couponsCount: 0,
        messageCount: 0,
    })
}))

export default useUserInfoStore;