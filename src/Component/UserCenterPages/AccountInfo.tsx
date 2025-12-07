/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/AccountInfo.tsx
import React, { useEffect, useRef, useState } from "react";
import zhCN from 'antd/es/date-picker/locale/zh_CN'; import { DatePicker, Result, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import AvatarCropper from "./AvatarCropper";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import { useRequest } from "ahooks";
import { getAccountInfo, updateAccountInfo, uploadAvatar } from "../../services/accountInfo";
import { getUserAvatarUrl } from "../../utils/imageConfig";

/** * 账户信息验证模式 * 使用zod库定义账户信息的验证规则 */
const accountInfoSchema = z.object({
    nickName: z.string().min(1, "昵称不能为空").max(30, "昵称不能超过30字"),
    sex: z.enum(["man", "woman", "secret"]),
    birthday: z
        .date()
        .refine((v) => v instanceof Date && !isNaN(v.getTime()), {
            message: "请选择生日",
        }),
});

/**
 * 账户信息表单类型
 */
type AccountInfoForm = z.infer<typeof accountInfoSchema>;




// -------------------- 主组件 --------------------
const AccountInfo: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [serverAvatarUrl, setServerAvatarUrl] = useState<string | null>(null);
    const [rawImageUrl, setRawImageUrl] = useState<string | null>(null); // 本地待裁切图片预览
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    // 存储 API 返回的不可编辑字段
    const [account, setAccount] = useState<string>("");
    const [memberType, setMemberType] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },  // isDirty: 表单是否被修改过
    } = useForm<AccountInfoForm>({
        resolver: zodResolver(accountInfoSchema),
        defaultValues: {
            nickName: "",
            sex: "secret",
            birthday: new Date(),
        },
        mode: "onChange" // onChange: 当表单值变化时触发验证
    });
 

    useEffect(() => {
        let mounted = true;  // 防止组件卸载后执行副作用
        (async () => {
            try {
                setLoading(true);
                const info = await getAccountInfo();
                if (!mounted) return;

                setAccount(info.account);
                setMemberType(info.memberType || "普通会员");
                setEmail(info.email);
                setServerAvatarUrl(info?.avatarUrl || null);

                // 将 API 的字段映射到表单：birthday -> Dayjs -> Date for zod
                const birthdayDate = info.birthday ? new Date(info.birthday) : new Date();
                reset({
                    nickName: info.nickName || "",
                    sex: (info.sex as AccountInfoForm["sex"]) || "secret",
                    birthday: birthdayDate,
                });
            } catch (e: any) {
                globalErrorHandler.handle(e, toast.error)
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [account, email, memberType, reset]);   


    const fileInputRef = useRef<HTMLInputElement | null>(null);  // 

    const handleChooseFile = () => {
        fileInputRef.current?.click();  // 触发文件选择
    };

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setRawImageUrl(url);
        setIsCropperOpen(true);
        e.currentTarget.value = ""; // 防止同一文件无法再次选择
    };

    // 2) 裁切后返回文件 -> 上传 -> 更新 avatar url
    const handleCroppedFile = async (file: File) => {
        setIsCropperOpen(false);
        const uploading = toast.loading("头像上传中...");
        try {
            const url = await uploadAvatar(file);
            setServerAvatarUrl(url);
            toast.success("头像上传成功");
        } catch (e: any) {
            toast.error(e?.message || "上传失败");
        } finally {
            toast.dismiss(uploading);
            if (rawImageUrl) {
                URL.revokeObjectURL(rawImageUrl);
                setRawImageUrl(null);
            }
        }
    };


    // ---------- 表单提交 ----------
    const onSubmit = async (data: AccountInfoForm) => {
        if (!isDirty) return;  // 如果表单没有修改过，则不提交
        updateInfoRun(data);
    };
    // 防抖
    const { run: updateInfoRun, loading: sumbitLoading } = useRequest((data: AccountInfoForm) => {
        const isoDate = (data.birthday as Date).toISOString().slice(0, 10);
        return updateAccountInfo({ ...data, birthday: isoDate })
    }, {
        manual: true, // 手动触发
        debounceLeading: true,  // 防抖方式：尾调用
        debounceWait: 300,
        onSuccess: (_, params) => {
            const [data] = params;
            reset(data)
        },
        onError: (e) => {
            globalErrorHandler.handle(e, toast.error)
        }
    })

    if (loading) {
        return (
            <div className="py-40 w-full flex items-center justify-center">
                <Spin />
            </div>
        );
    }

    if (!account) {
        return (
        <Result
            status="500"
            title="500"
            subTitle="Sorry, you are not authorized to access this page."
        />)
    }


    return (
        <div className="py-6 w-full px-6 mx-auto space-y-6 max-w-5xl">
            <h1 className="text-2xl pb-[20px] font-bold text-[#4b4b4b] text-center">
                <span className="inline-block w-[2px] h-6 bg-blue-500 mr-2 align-middle"></span>
                <span>账号信息管理</span>
            </h1>

            <div className="flex items-start gap-10 w-full">
                <div className="w-[60%] space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                        <span className="inline-block w-[2px] h-5 bg-blue-500" />
                        <span>账号信息</span>
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-[15px]">
                        <div className="flex items-center h-[36px]">
                            <label className="w-28 text-gray-600 font-medium">会员账号：</label>
                            <span className="text-gray-800">{account || "暂无"}</span>
                        </div>

                        <div className="flex items-center h-[36px]">
                            <label className="w-28 text-gray-600 font-medium">会员类型：</label>
                            <span className="text-gray-800">{memberType || "普通会员"}</span>
                        </div>

                        <div className="flex items-center h-[48px]">
                            <label className="relative w-28 text-gray-600 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                会员昵称：
                            </label>
                            <input
                                {...register("nickName")}
                                type="text"
                                className={`border border-gray-300 px-3 py-1 w-[200px] rounded-sm focus:outline-none transition-all duration-150
                  ${errors.nickName ? "border-red-500" : "focus:border-blue-500"}`}
                                placeholder="请输入昵称"
                            />
                            {errors.nickName && (
                                <span className="text-red-500 ml-3 text-sm">{errors.nickName.message}</span>
                            )}
                        </div>

                        <div className="flex items-center h-[48px]">
                            <label className="relative w-28 text-gray-600 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                性别：
                            </label>

                            <Controller
                                control={control}
                                name="sex"
                                render={({ field }) => (
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                {...field}
                                                value="man"
                                                checked={field.value === "man"}
                                            />
                                            男
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                {...field}
                                                value="woman"
                                                checked={field.value === "woman"}
                                            />
                                            女
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                {...field}
                                                value="secret"
                                                checked={field.value === "secret"}
                                            />
                                            保密
                                        </label>
                                    </div>
                                )}
                            />
                            {errors.sex && <span className="text-red-500 ml-3 text-sm">{errors.sex.message}</span>}
                        </div>

                        <div className="flex items-center h-[48px]">
                            <label className="relative w-28 text-gray-600 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                生日：
                            </label>

                            <Controller
                                control={control}
                                name="birthday"
                                render={({ field }) => {
                                    const value = field.value ? dayjs(field.value as Date) : undefined;
                                    return (
                                        <DatePicker
                                            locale={zhCN}
                                            value={value as Dayjs | undefined}
                                            onChange={(d) => {
                                                if (d) {
                                                    const dt = (d as Dayjs).toDate();
                                                    field.onChange(dt);
                                                } else {
                                                    field.onChange(undefined);
                                                }
                                            }}
                                            className="w-[200px] rounded-sm"
                                            disabledDate={(current) => current && current > dayjs().endOf("day")} // 这是一个限制日期范围的例子
                                        />
                                    );
                                }}
                            />
                            {errors.birthday && <span className="text-red-500 whitespace-nowrap ml-3  text-sm">请选择生日</span>}
                        </div>

                        <div className="flex items-center h-[40px]">
                            <div className="w-28" />
                            <button
                                type="submit"
                                className="mt-2 px-6 py-2 w-[120px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-60"
                                disabled={sumbitLoading}
                            >
                                {sumbitLoading ? "保存中..." : "保存修改"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="w-[1px] bg-gray-300 self-stretch" />

                <div className="w-[40%] flex flex-col items-center space-y-4">
                    <div className="mt-8">
                        <img
                            src={getUserAvatarUrl(serverAvatarUrl)}
                            alt="avatar"
                            className="w-40 h-40 bg-gray-200 object-cover"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            onClick={handleChooseFile}
                            className="px-4 py-1 text-[#2f2f2f] rounded-sm hover:text-blue-500 text-[13px]"
                        >
                            上传头像
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <h2 className="text-xl font-semibold text-gray-700 border-l-4 border-blue-500 pl-2">
                    关联账号
                </h2>

                <div className="flex items-center text-[15px]">
                    <span className="w-28 text-gray-600 font-medium">我的邮箱：</span>
                    <input
                        type="text"
                        className="border pl-4 pr-4 py-1.5 text-[#5e5e5e] rounded-sm disabled:bg-gray-50 disabled:cursor-not-allowed w-[45%]"
                        disabled
                        value={email || '暂无'}
                    />
                </div>
            </div>

            {/* 横线 */}
            <div className="w-full h-[1px] mt-5 bg-gray-300" />

            {/* 裁切弹窗 */}
            {isCropperOpen && rawImageUrl && (
                <AvatarCropper
                    src={rawImageUrl}
                    onClose={() => {
                        setIsCropperOpen(false);
                        if (rawImageUrl) {
                            URL.revokeObjectURL(rawImageUrl);
                            setRawImageUrl(null);
                        }
                    }}
                    onCroppedFile={handleCroppedFile}
                />
            )}

        </div>
    );
};

export default AccountInfo;
