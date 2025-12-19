import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosService, { type DeviceInfo } from "../../services/AxiosService";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import { useRequest } from "ahooks";
import { Pagination, Result, Spin } from "antd";
import DeviceCard from "./DeviceCard";



// ========================= 主组件 =========================
export default function DeviceManager() {
    const [devices, setDevices] = useState<DeviceInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [logoutAll, setLogoutAll] = useState(false);

    // 分页
    const pageSize = 8;
    const [page, setPage] = useState(1);

    const paginated = devices.slice((page - 1) * pageSize, page * pageSize);

    // 模拟数据加载
    useEffect(() => {
        const fetchData = async () => {
            try {
                const devices = await axiosService.getLoginDevices();
                setDevices(devices);
            } catch (err) {
                globalErrorHandler.handle(err, toast.error);
            } finally {
                setLoading(false);
            }
        };
        setTimeout(fetchData, 100);
    }, []);

    const { run: logoutRequest } = useRequest((deviceId: string) => axiosService.logoutDevice(deviceId), {
        manual: true,
        debounceTrailing: true,
        debounceWait: 1000,
        onSuccess: (_, params) => {
            const deviceId = params[0];
            setDevices((prev) => prev.filter((x) => x.device_id !== deviceId));
            setProcessingId(null);
        },
        onError: (err) => {
            globalErrorHandler.handle(err, toast.error);
            setProcessingId(null);
        },
    });

    async function handleOutAllDevices() {
        if (devices.length === 1 && devices[0].device_id === axiosService.getCurrentDeviceInfo().deviceId) {
            setLogoutAll(false);
            return;
        }
        try {
            await axiosService.logoutOtherDevices();
            setDevices(prev => prev.filter((value) => value.device_id === axiosService.getCurrentDeviceInfo().deviceId))
        } catch (error) {
            globalErrorHandler.handle(error, toast.error);
        } finally {
            setLogoutAll(false);
        }
    }

    if (loading) return (
        <div className="py-40 w-full flex items-center justify-center">
            <Spin />
        </div>
    )
    if (devices.length === 0) {
        return (
            <Result
                status="500"
                title="500"
                subTitle="Sorry, you are not authorized to access this page."
            />)
    }

    return (
        <div className="py-6 w-full px-6 mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6 py-4 pl-4 bg-white rounded-sm border-b-2 border-gray-100">
                <div className="flex flex-col">
                    <h1 className="text-[22px] font-semibold text-gray-800 leading-tight">
                        登录设备管理
                    </h1>
                    <span className="text-gray-500 text-sm mt-1">
                        当前共绑定 <span className="font-medium text-gray-700">{devices.length}</span> 台设备
                    </span>
                </div>

                <div className="flex items-eng ">
                    <button
                        onClick={() => {
                            setLogoutAll(true);
                            setTimeout(handleOutAllDevices, 500)
                        }}
                        disabled={logoutAll}
                        className={`
                px-5 py-2 rounded-sm text-white font-medium shadow w-[120px]
                transition-all duration-200
                ${logoutAll
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gray-400 hover:bg-gray-500'}
            `}
                    >
                        {logoutAll ? '解绑中...' : '一键解绑'}
                    </button>
                </div>
            </div>

            <>
                <div className={`grid gap-2 auto-rows-max min-h-[520px] ${paginated.length <= 3
                    ? 'grid-cols-1'
                    : 'grid-cols-1 sm:grid-cols-2'
                    }`}>
                    {paginated.map((d) => {
                        const isCurrent = axiosService.getCurrentDeviceInfo().deviceId === d.device_id;
                        const isProcessing = logoutAll ? true : processingId === d.device_id;

                        return (
                            <DeviceCard
                                key={d.device_id}
                                d={d}
                                isCurrent={isCurrent}
                                isProcessing={isProcessing}
                                onLogout={(id) => {
                                    setProcessingId(id);
                                    logoutRequest(id);
                                }}
                            />
                        );
                    })}
                </div>

                <Pagination
                    align="center"
                    pageSize={pageSize}
                    current={page}
                    total={devices.length}
                    showSizeChanger={false}
                    className="w-full mt-4"
                    onChange={(p) => setPage(p)}
                />
            </>

        </div>
    );
}

