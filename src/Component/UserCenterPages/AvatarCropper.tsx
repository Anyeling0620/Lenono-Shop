/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";

interface AvatarCropperProps {
    src: string;
    onClose: () => void;
    onCroppedFile: (file: File) => void;
}

function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
}

/**
 * 头像裁切组件
 * 用于用户上传和裁切头像图片
 */
const AvatarCropper: React.FC<AvatarCropperProps> = ({ src, onClose, onCroppedFile }) => {
    // 裁切位置状态
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    // 缩放级别状态
    const [zoom, setZoom] = useState(1);
    // 旋转角度状态
    const [rotation, setRotation] = useState(0);
    // 裁切区域像素信息
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    // 处理状态，用于显示加载状态
    const [isProcessing, setIsProcessing] = useState(false);

    // 裁切完成回调函数
    const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {  
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    /**
     * 创建裁切后的图片
     * 将裁切区域转换为图片文件
     */
    const createCroppedImage = async () => {
        if (!croppedAreaPixels) return;  //  如果没有裁切区域，则直接返回
        setIsProcessing(true);

        // 创建新图片对象
        const image = new Image();
        image.src = src;
        image.onload = () => {
            // 创建画布
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // 获取裁切区域参数
            const { width, height, x, y } = croppedAreaPixels;

            // 旋转后的画布
            const rotRad = getRadianAngle(rotation);
            const sin = Math.abs(Math.sin(rotRad));
            const cos = Math.abs(Math.cos(rotRad));
            canvas.width = width * cos + height * sin;
            canvas.height = width * sin + height * cos;

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotRad);
            ctx.drawImage(
                image,
                x,
                y,
                width,
                height,
                -width / 2,
                -height / 2,
                width,
                height
            );

            canvas.toBlob((blob) => {
                setIsProcessing(false);
                if (!blob) return toast.error("裁切失败");
                const file = new File([blob], `avatar_${Date.now()}.png`, { type: blob.type || "image/png" });
                onCroppedFile(file);
            }, "image/png");
        };
    };

    return (
        <div className=" absolute -top-8 inset-0 z-[10003] flex items-center justify-center bg-black/15  ">
            <div className="bg-white rounded-sm p-4 w-full max-w-2xl">
                <div className="flex justify-between items-center pb-4 h-[30px]">
                    <h3 className="text-lg font-medium">裁切头像</h3>
                    <button type="button" onClick={onClose} className="text-[35px] font-light text-[#5f5f5f] hover:text-blue-500">×</button>
                </div>


                <div className="relative w-full h-[360px] bg-gray-100">
                    <Cropper
                        image={src}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    {/* 缩放 */}
                    <div className="flex flex-col">
                        <div className="flex justify-between text-sm font-medium mb-1">
                            <span>缩放</span>
                            <span>{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1 bg-gray-300 appearance-none cursor-pointer rounded-sm"
                            style={{
                                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(zoom - 1) / 2 * 100}%, #d1d5db ${(zoom - 1) / 2 * 100}%, #d1d5db 100%)`,
                            }}
                        />
                    </div>

                    {/* 旋转 */}
                    <div className="flex flex-col">
                        <div className="flex justify-between text-sm font-medium mb-1">
                            <span>旋转</span>
                            <span>{rotation}°</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={rotation}
                            onChange={(e) => setRotation(Number(e.target.value))}
                            className="w-full h-1 bg-gray-300 appearance-none cursor-pointer rounded-sm"
                            style={{
                                background: `linear-gradient(to right, #10b981 0%, #10b981 ${rotation / 360 * 100}%, #d1d5db ${rotation / 360 * 100}%, #d1d5db 100%)`,
                            }}
                        />
                    </div>
                </div>



                <div className="flex justify-center mt-4">

                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-sm"
                        onClick={createCroppedImage}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "处理中..." : "裁切并上传"}
                    </button>
                </div>

            </div>



        </div>
    );
};

export default AvatarCropper;
