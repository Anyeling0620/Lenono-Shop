import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosService, { type DeviceInfo } from "../../services/axiosService";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import { useRequest } from "ahooks";
import { Pagination, Result, Spin } from "antd";
import DeviceCard from "./DeviceCard";



// ========================= 主组件 =========================
export default function DeviceManager() {
    const [devices, setDevices] = useState<DeviceInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // 分页
    const pageSize = 8;
    const [page, setPage] = useState(1);

    const paginated = devices.slice((page - 1) * pageSize, page * pageSize);

    // 模拟数据加载
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const data: DeviceInfo[] = Array.from({ length: 24 }).map((_, i) => ({
                //     device_id: String(i + 1),
                //     device_type: i % 2 === 0 ? "web" : "mobile_web",
                //     device_name: i % 2 === 0 ? `Chrome Device ${i + 1} 1233333` : `Safari iPhone ${i + 1}`,
                //     login_time: "2025-01-12 14:23:11",
                //     ip_address: `192.168.0.${i}`,
                // }));

                // await new Promise((r) => setTimeout(r, 400));

                const devices = await axiosService.getLoginDevices();
                setDevices(devices);
            } catch (err) {
                globalErrorHandler.handle(err, toast.error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // API 请求封装
    const { run: logoutRequest } = useRequest(axiosService.logoutDevice, {
        manual: true, 
        debounceTrailing: true,
        debounceWait: 1000,
        onSuccess: (_, params) => {
            const deviceId = params[0];
          //   const currentId = axiosService.getCurrentDeviceInfo().deviceId;

          //  toast.success(deviceId === currentId ? "已退出登录" : "已解绑设备");

            setDevices((prev) => prev.filter((x) => x.device_id !== deviceId));
            setProcessingId(null);
        },
        onError: (err) => {
            globalErrorHandler.handle(err, toast.error);
            setProcessingId(null);
        },
    });
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
            <h1 className="text-2xl font-bold text-[#4b4b4b] text-center mb-4">登录设备管理</h1>

            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 auto-rows-max min-h-[540px]">
                    {paginated.map((d) => {
                        const isCurrent = axiosService.getCurrentDeviceInfo().deviceId === d.device_id;
                        const isProcessing = processingId === d.device_id;

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

