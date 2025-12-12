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
import axiosService, { type ApiResponse, axiosInstance } from '../../services/axiosService';
import { API_PATHS } from '../../services/apiPaths';
import globalErrorHandler from '../../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';

const { TabPane } = Tabs;

// ========== 验证 Schema ==========
const codeSchema = z.object({
    oldEmail: z.string().email('请输入有效的旧邮箱地址'),
    oldCode: z.string().regex(/^\d{6}$/, '验证码必须为6位数字'),
    newEmail: z.string().email('请输入有效的新邮箱地址'),
    newCode: z.string().regex(/^\d{6}$/, '验证码必须为6位数字'),
}).refine((data) => data.oldEmail !== data.newEmail, {
    message: '新邮箱不能与旧邮箱相同',
    path: ['newEmail'],
});

const passwordSchema = z.object({
    password: z.string()
        .nonempty('密码不能为空')
        .min(6, '密码至少需要6位字符')
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
    newEmail: z.string().email('请输入有效的新邮箱地址'),
    newCode: z.string().regex(/^\d{6}$/, '验证码必须为6位数字'),
});



// ========== 表单值类型 ==========
type CodeFormValues = z.infer<typeof codeSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface ChangeEmailProps {
    onSubmitByCode?: (data: CodeFormValues) => Promise<void>;
    onSubmitByPassword?: (data: PasswordFormValues) => Promise<void>;
}

const ChangeEmail: React.FC<ChangeEmailProps> = ({ onSubmitByCode, onSubmitByPassword }) => {
    const [activeTab, setActiveTab] = useState<'code' | 'password'>('code');
    const [currentStepCode, setCurrentStepCode] = useState(0);
    const [currentStepPassword, setCurrentStepPassword] = useState(0);
    const currentEmail = useUserInfoStore((state) => state.email);

    const codeMethods = useForm<CodeFormValues>({
        resolver: zodResolver(codeSchema),
        defaultValues: { oldEmail: currentEmail || '', oldCode: '', newEmail: '', newCode: '' },
        mode: 'onChange',
    });

    const passwordMethods = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: '', newEmail: '', newCode: '' },
        mode: 'onChange',
    });

    const { trigger: triggerCode, handleSubmit: handleSubmitCode, watch: watchCode, formState: { errors: errorsCode } } = codeMethods;
    const { trigger: triggerPassword, handleSubmit: handleSubmitPassword, watch: watchPassword, formState: { errors: errorsPassword } } = passwordMethods;

    const { isSending: sendingOld, countdown: countdownOld, startCountdown: startOldCountdown } = useVerificationCode();
    const { isSending: sendingNew, countdown: countdownNew, startCountdown: startNewCountdown } = useVerificationCode();


    const { run: sendCode } = useRequest(
        (email) => axiosInstance.post(API_PATHS.SEND_VERIFICATION_CODE, {
            email,
        }),
        {
            manual: true,
            debounceWait: 300,
            onError: (err) => {
                globalErrorHandler.handle(err, toast.error)
            }
        }
    )

    const sendOldCode = async () => {
        const email = watchCode('oldEmail');
        if (!email) return message.error('邮箱为空，请刷新');
        if (email !== currentEmail) return message.error('请输入正确的旧邮箱');
        sendCode(email)
        startOldCountdown();
        // message.success('旧邮箱验证码已发送');
    };

    const sendNewCodeByCode = async () => {
        const email = watchCode('newEmail');
        if (!email) return message.error('请输入新邮箱');
        if (email === currentEmail) return message.error('新邮箱不能与旧邮箱相同');

        sendCode(email)
        startNewCountdown();
        // message.success('新邮箱验证码已发送');
    };

    const sendNewCodeByPassword = async () => {
        const email = watchPassword('newEmail');
        if (!email) return message.error('请输入新邮箱');
        sendCode(email)
        startNewCountdown();
        //message.success('新邮箱验证码已发送');
    };

    // 点击“下一步”时验证当前步骤
    const nextStepCode = async () => {
        let valid = false;
        if (currentStepCode === 0) {
            valid = await triggerCode(['oldEmail', 'oldCode']);
        } else if (currentStepCode === 1) {
            valid = await triggerCode(['newEmail', 'newCode']);
        }
        if (valid) setCurrentStepCode((prev) => prev + 1);
    };

    const nextStepPassword = async () => {
        let valid = false;
        if (currentStepPassword === 0) {
            valid = await triggerPassword(['password']);
        } else if (currentStepPassword === 1) {
            valid = await triggerPassword(['newEmail', 'newCode']);
        }
        if (valid) setCurrentStepPassword((prev) => prev + 1);
    };


    interface ChangeEmailPayload {
        type: 'code' | 'password';
        old_email?: string;
        old_code?: string;
        new_email: string;
        new_code: string;
        password?: string;
    }
    const { run: changeEmail } = useRequest(
        (payload: ChangeEmailPayload) => axiosInstance.post<ApiResponse<null>>(API_PATHS.USER_CHANGE_EMAIL, payload),
        {
            manual: true,
            onSuccess: () => {
                axiosService.forceLogout();
            },
            onError: (err) => {
                globalErrorHandler.handle(err, toast.error);
            }
        }
    );

    const handleChangeEmail = async () => {
        if (activeTab === 'code') {
            const values = codeMethods.getValues();
            await changeEmail({
                type: 'code',
                old_email: values.oldEmail,
                old_code: values.oldCode,
                new_email: values.newEmail,
                new_code: values.newCode,
            });
        } else {
            const values = passwordMethods.getValues();
            await changeEmail({
                type: 'password',
                new_email: values.newEmail,
                new_code: values.newCode,
                password: values.password,
            });
        }
    };


    return (
        <div className="p-6 w-full mx-auto">
            {/* Header */}
            <div className="mb-6 py-4 pl-4 bg-white rounded-sm border-b-2 border-gray-100">
                <h1 className="text-[22px] pb-2 font-semibold text-gray-800 leading-tight">
                    更换邮箱
                </h1>
            </div>
            <div className='px-10'>

                <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as 'code' | 'password')}>
                    <TabPane tab="通过验证码" key="code">
                        <Steps
                            current={currentStepCode}
                            size="small"
                            items={[
                                { title: '验证旧邮箱' },
                                { title: '输入新邮箱' },
                                { title: '确认提交' },
                            ]}
                            className="mb-4"
                        />
                        <FormProvider {...codeMethods}>
                            <form onSubmit={handleSubmitCode(onSubmitByCode || (() => { }))} className="flex flex-col gap-4">
                                {currentStepCode === 0 && (
                                    <>
                                        <FormField type="email" disabled placeholder="请输入旧邮箱" error={errorsCode.oldEmail?.message} {...codeMethods.register('oldEmail')} />
                                        <VerificationCodeField placeholder="请输入旧邮箱验证码" error={errorsCode.oldCode?.message} verificationSent={sendingOld} countdown={countdownOld} onSendCode={sendOldCode} {...codeMethods.register('oldCode')} />
                                        <SubmitButton label="下一步" onClick={nextStepCode} type="button" className='w-auto mt-5' />
                                    </>
                                )}
                                {currentStepCode === 1 && (
                                    <>
                                        <FormField type="email" placeholder="请输入新邮箱" error={errorsCode.newEmail?.message} {...codeMethods.register('newEmail')} />
                                        <VerificationCodeField placeholder="请输入新邮箱验证码" error={errorsCode.newCode?.message} verificationSent={sendingNew} countdown={countdownNew} onSendCode={sendNewCodeByCode} {...codeMethods.register('newCode')} />
                                        <div className="flex justify-between gap-2 mt-5">
                                            <SubmitButton label="上一步" onClick={() => setCurrentStepCode(0)} type="button" className='w-1/2' />
                                            <SubmitButton label="下一步" onClick={nextStepCode} type="button" className='w-1/2' />
                                        </div>
                                    </>
                                )}
                                {currentStepCode === 2 && (
                                    <>
                                        <div className="flex justify-between gap-2 mt-5">
                                            <SubmitButton label="上一步" onClick={() => setCurrentStepCode(1)} type="button" className='w-1/2 ' />
                                            <SubmitButton label="提交" onClick={handleChangeEmail} loading={codeMethods.formState.isSubmitting} className='w-1/2' />
                                        </div>
                                    </>
                                )}
                            </form>
                        </FormProvider>
                    </TabPane>

                    <TabPane tab="通过密码" key="password">
                        <Steps
                            current={currentStepPassword}
                            size="small"
                            items={[
                                { title: '验证密码' },
                                { title: '输入新邮箱' },
                                { title: '确认提交' },
                            ]}
                            className="mb-4"
                        />
                        <FormProvider {...passwordMethods}>
                            <form onSubmit={handleSubmitPassword(onSubmitByPassword || (() => { }))} className="flex flex-col gap-4">
                                {currentStepPassword === 0 && (
                                    <>
                                        <FormField type="password" placeholder="请输入账户密码" error={errorsPassword.password?.message} {...passwordMethods.register('password')} />
                                        <SubmitButton label="下一步" onClick={nextStepPassword} type="button" className='mt-5' />
                                    </>
                                )}
                                {currentStepPassword === 1 && (
                                    <>
                                        <FormField type="email" placeholder="请输入新邮箱" error={errorsPassword.newEmail?.message} {...passwordMethods.register('newEmail')} />
                                        <VerificationCodeField placeholder="请输入新邮箱验证码" error={errorsPassword.newCode?.message} verificationSent={sendingNew} countdown={countdownNew} onSendCode={sendNewCodeByPassword} {...passwordMethods.register('newCode')} />
                                        <div className="flex justify-between gap-2 mt-5">
                                            <SubmitButton label="上一步" onClick={() => setCurrentStepPassword(0)} type="button" className='w-1/2' />
                                            <SubmitButton label="下一步" onClick={nextStepPassword} type="button" className='w-1/2' />
                                        </div>
                                    </>
                                )}
                                {currentStepPassword === 2 && (
                                    <>
                                        <div className="flex justify-between gap-2 mt-5">
                                            <SubmitButton label="上一步" onClick={() => setCurrentStepPassword(1)} type="button" className='w-1/2' />
                                            <SubmitButton label="提交" onClick={handleChangeEmail} loading={passwordMethods.formState.isSubmitting} className='w-1/2' />
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

export default ChangeEmail;
