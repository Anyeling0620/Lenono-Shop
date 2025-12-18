import { axiosInstance, type ApiResponse } from "./AxiosService";

export interface Notice {
    id: number;
    title: string;
    content: string;
    time: string;
    read: boolean;
    type: "system" | "event" | "info";
}

/** 获取所有通知 */
export async function fetchNotices() {
    const res = await axiosInstance.get<ApiResponse<{ notices: Notice[] }>>(
        "/user/notices"
    );
    return res.data?.data?.notices ?? [];
}

/** 获取未读数量 */
export async function fetchUnreadCount() {
    const res = await axiosInstance.get<ApiResponse<{ unreadCount: number }>>(
        "/user/notices/unreadCount"
    );
    return res.data?.data?.unreadCount ?? 0;
}

/** 标记单条已读 */
export async function markNoticeRead(id: number) {
    axiosInstance.patch<ApiResponse<null>>(`/user/notices/${id}/read`);
    return true
}

/** 全部标记为已读 */
export async function markAllReadRequest() {
    axiosInstance.patch<ApiResponse<null>>("/user/notices/read-all");
    return true
}

/** 删除已读通知 */
export async function deleteReadRequest() {
    axiosInstance.delete<ApiResponse<null>>("/user/notices/delete-read");
    return true

}

/** 清空全部通知 */
export async function clearAllRequest() {
    axiosInstance.delete<ApiResponse<null>>("/user/notices/clear-all");
    return true
}
