import React, { useState } from 'react';
import { Tabs, Steps, message } from 'antd';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormField from '../Auth/FormField';
import VerificationCodeField from '../Auth/VerificationCodeField';
import SubmitButton from '../Auth/SubmitButton';
import useVerificationCode from '../../hooks/useVerificationCode';
import useUserInfoStore from '../../store/userInfostore';
import { useRequest } from 'ahooks';
import axiosService, { type ApiResponse, axiosInstance } from '../../services/AxiosService';
import { API_PATHS } from '../../services/apiPaths';
import globalErrorHandler from '../../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';

const { TabPane } = Tabs;



// ========== 验证 Schema ==========
const codeSchema = z.object({
    email: z.string().email('请输入有效的邮箱地址'),
    code: z.string().regex(/^\d{6}$/, '验证码必须为6位数字'),
    newPassword: z.string().min(6, '密码至少需要6位字符').regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
    confirmPassword: z.string().min(6, '请确认密码').regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: '两次密码输入不一致',
    path: ['confirmPassword'],
});

const passwordSchema = z.object({
    oldPassword: z.string()
        .nonempty('原密码不能为空')
        .min(6, '密码至少需要6位字符')
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
    newPassword: z.string()
        .nonempty('密码不能为空')
        .min(6, '密码至少需要6位字符')
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
    confirmPassword: z.string().nonempty('请确认密码'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: '两次密码输入不一致',
    path: ['confirmPassword'],
}).refine((data) => data.oldPassword !== data.newPassword, {
    message: '新密码不能与原密码相同',
    path: ['newPassword'],
});

// ========== 表单类型 ==========
type CodeFormValues = z.infer<typeof codeSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface ChangePasswordProps {
    onSubmitByCode?: (data: CodeFormValues) => Promise<void>;
    onSubmitByPassword?: (data: PasswordFormValues) => Promise<void>;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onSubmitByCode, onSubmitByPassword }) => {
    const [activeTab, setActiveTab] = useState<'code' | 'password'>('code');
    const [currentStepCode, setCurrentStepCode] = useState(0);
    const [currentStepPassword, setCurrentStepPassword] = useState(0);
    const currentEmail = useUserInfoStore((state) => state.email);


    const codeMethods = useForm<CodeFormValues>({
        resolver: zodResolver(codeSchema),
        defaultValues: { email: currentEmail, code: '', newPassword: '', confirmPassword: '' },
        mode: 'onChange',
    });

    const passwordMethods = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
        mode: 'onChange',
    });

    const { trigger: triggerCode, handleSubmit: handleSubmitCode, watch: watchCode, formState: { errors: errorsCode } } = codeMethods;
    const { trigger: triggerPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword } } = passwordMethods;

    const { isSending: sendingCode, countdown: countdownCode, startCountdown: startCodeCountdown } = useVerificationCode();

    // 发送验证码
    const sendCode = async () => {
        const email = watchCode('email');
        if (!email) return message.error('请输入邮箱');
        if (email !== currentEmail) return message.error('请输入正确的邮箱');
        startCodeCountdown();
        message.success('验证码已发送');
    };

    // 下一步函数
    const nextStepCode = async () => {
        let valid = false;
        if (currentStepCode === 0) {
            valid = await triggerCode(['email', 'code']);
        } else if (currentStepCode === 1) {
            valid = await triggerCode(['newPassword']);
        }
        if (valid) setCurrentStepCode(prev => prev + 1);
    };

    const nextStepPassword = async () => {
        let valid = false;
        if (currentStepPassword === 0) {
            valid = await triggerPassword(['oldPassword']);
        } else if (currentStepPassword === 1) {
            valid = await triggerPassword(['newPassword']);
        }
        if (valid) setCurrentStepPassword(prev => prev + 1);
    };


    interface ChangePasswordPayload {
        type: 'email' | 'password';
        email?: string;
        code?: string;
        new_password: string;
        confirm_password: string;
        old_password?: string;
    }
    const { run: changePassword } = useRequest((payload: ChangePasswordPayload) =>
        axiosInstance.post<ApiResponse<null>>(API_PATHS.USER_CHANGE_PASSWORD,
            payload
        ), {
        manual: true,
        onSuccess: () => {
            message.success('密码修改成功');
            axiosService.forceLogout()
        },
        onError: (err) => {
            globalErrorHandler.handle(err, toast.error)
        }
    })

    async function handleChangePassword() {
        if (activeTab === 'code') {
            const values = codeMethods.getValues();
            await changePassword({
                type: 'email',
                email: values.email,
                code: values.code,
                new_password: values.newPassword,
                confirm_password: values.confirmPassword,
            })
        } else if (activeTab === 'password') {
            const values = passwordMethods.getValues();
            await changePassword({
                type: 'password',
                old_password: values.oldPassword,
                new_password: values.newPassword,
                confirm_password: values.confirmPassword,
            })
        }


    }

    return (
        <div className="p-6 w-full mx-auto">
            <div className="mb-6 py-4 pl-4 bg-white rounded-sm border-b-2 border-gray-100">
                <h1 className="text-[22px] pb-2 font-semibold text-gray-800 leading-tight">修改密码</h1>
            </div>
            <div className="px-10">
                <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as 'code' | 'password')}>
                    {/* 通过验证码 */}
                    <TabPane tab="通过验证码" key="code">
                        <Steps
                            current={currentStepCode}
                            size="small"
                            items={[
                                { title: '验证邮箱' },
                                { title: '新密码' },
                                { title: '确认密码' },
                            ]}
                            className="mb-4"
                        />
                        <FormProvider {...codeMethods}>
                            <form onSubmit={handleSubmitCode(onSubmitByCode || (() => { }))} className="flex flex-col gap-4">
                                {currentStepCode === 0 && (
                                    <>
                                        <FormField type="email" disabled placeholder="请输入邮箱" error={errorsCode.email?.message} {...codeMethods.register('email')} />
                                        <VerificationCodeField placeholder="请输入验证码" error={errorsCode.code?.message} verificationSent={sendingCode} countdown={countdownCode} onSendCode={sendCode} {...codeMethods.register('code')} />
                                        <SubmitButton label="下一步" onClick={nextStepCode} type="button" className="mt-5 w-auto" />
                                    </>
                                )}
                                {currentStepCode === 1 && (
                                    <>
                                        <FormField type="password" placeholder="请输入新密码" error={errorsCode.newPassword?.message} {...codeMethods.register('newPassword')} />
                                        <div className="flex justify-between gap-2 mt-5">
                                            <SubmitButton label="上一步" onClick={() => setCurrentStepCode(0)} type="button" className="w-1/2" />
                                            <SubmitButton label="下一步" onClick={nextStepCode} type="button" className="w-1/2" />
                                        </div>
                                    </>
                                )}
                                {currentStepCode === 2 && (
                                    <>
                                        <FormField type="password" placeholder="请确认新密码" error={errorsCode.confirmPassword?.message} {...codeMethods.register('confirmPassword')} />
                                        <div className="flex justify-between gap-2 mt-5">
                                            <SubmitButton label="上一步" onClick={() => setCurrentStepCode(1)} type="button" className='w-1/2' />
                                            <SubmitButton label="提交" onClick={handleChangePassword} loading={codeMethods.formState.isSubmitting} className='w-1/2' />
                                        </div>
                                    </>
                                )}
                            </form>
                        </FormProvider>
                    </TabPane>

                    {/* 通过原密码 */}
                    <TabPane tab="通过原密码" key="password">
                        <Steps
                            current={currentStepPassword}
                            size="small"
                            items={[
                                { title: '原密码' },
                                { title: '新密码' },
                                { title: '确认密码' },
                            ]}
                            className="mb-4"
                        />
                        <FormProvider {...passwordMethods}>
                            <form onSubmit={handleSubmitPassword(onSubmitByPassword || (() => { }))} className="flex flex-col gap-4">
                                {currentStepPassword === 0 && (
                                    <>
                                        <FormField type="password" placeholder="请输入原密码" error={errorsPassword.oldPassword?.message} {...passwordMethods.register('oldPassword')} />
                                        <SubmitButton label="下一步" onClick={nextStepPassword} type="button" className="mt-5" />
                                    </>
                                )}
                                {currentStepPassword === 1 && (
                                    <>
                                        <FormField type="password" placeholder="请输入新密码" error={errorsPassword.newPassword?.message} {...passwordMethods.register('newPassword')} />
                                        <div className="flex justify-between gap-2 mt-5">
                                            <SubmitButton label="上一步" onClick={() => setCurrentStepPassword(0)} type="button" className="w-1/2" />
                                            <SubmitButton label="下一步" onClick={nextStepPassword} type="button" className="w-1/2" />
                                        </div>
                                    </>
                                )}
                                {currentStepPassword === 2 && (
                                    <>
                                        <FormField type="password" placeholder="请确认新密码" error={errorsPassword.confirmPassword?.message} {...passwordMethods.register('confirmPassword')} />
                                        <div className="flex justify-between gap-2 mt-5">
                                            <SubmitButton label="上一步" onClick={() => setCurrentStepPassword(1)} type="button" className="w-1/2" />
                                            <SubmitButton label="提交" onClick={handleChangePassword} loading={passwordMethods.formState.isSubmitting} className="w-1/2" />
                                        </div>
                                    </>
                                )}
                            </form>
                        </FormProvider>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default ChangePassword;




