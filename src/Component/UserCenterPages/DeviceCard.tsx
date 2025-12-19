import type { DeviceInfo } from "../../services/AxiosService";
import React from "react";

interface DeviceCardProps {
    d: DeviceInfo;
    isCurrent: boolean;
    isProcessing: boolean;
    onLogout: (id: string) => void;
}
const  DeviceCard:React.FC<DeviceCardProps> = ({ d, isCurrent, isProcessing, onLogout }) => {
    return (
        <div
            className={`p-4 h-[125px] rounded-sm shadow-md bg-white hover:shadow-xl transition-shadow duration-300 text-sm relative ${
                isCurrent ? " text-red-500 " : ""
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                {/* 左侧设备信息 */}
                <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 max-w-[250px]">
                        {isCurrent && (
                            <span className="bg-blue-400 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                                当前设备
                            </span>
                        )}

                        <p className="font-semibold text-base max-w-[200px] truncate">
                            {d.device_name || "未知设备"}
                        </p>
                    </div>

                    <p className="text-gray-600">类型：{d.device_type}</p>
                    <p className="text-gray-600">登录时间：{d.login_time}</p>
                    <p className="text-gray-600">IP：{d.ip_address || "无"}</p>
                </div>

                {/* 右侧按钮与图标 */}
                <div className="flex flex-col items-end gap-2 min-w-[90px]">
                    <div className="text-3xl opacity-30 select-none ">
                        {d.device_type === "web" ? "🖥️" : "📱"}
                    </div>
                    <button
                        disabled={isProcessing}
                        onClick={() => !isProcessing && onLogout(d.device_id)}
                        className={`px-3 w-[50px] flex justify-center items-center py-1 rounded-lg text-xs transition-all duration-200 ${
                            isCurrent ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-200 hover:bg-gray-300"
                        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isProcessing ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            "解绑"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeviceCard;