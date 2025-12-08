import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField } from '../Auth/FormField';
import { VerificationCodeField } from '../Auth/VerificationCodeField';
import { SubmitButton } from '../Auth/SubmitButton';

// 定义表单验证 schema
const schema = z.object({
  password: z.string().min(1, '请输入账户密码'),
  newEmail: z.string().email('请输入有效的新邮箱地址'),
  newCode: z.string().regex(/^\d{6}$/, '验证码必须为6位数字'),
});

type FormData = z.infer<typeof schema>;

interface ChangeEmailByPasswordProps {
  onSubmit?: (data: FormData) => Promise<void>; // 可选的提交回调
}

const ChangeEmailByPassword: React.FC<ChangeEmailByPasswordProps> = ({ onSubmit }) => {
  const [verificationSentNew, setVerificationSentNew] = useState(false);
  const [countdownNew, setCountdownNew] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      newEmail: '',
      newCode: '',
    },
  });

  const { handleSubmit, formState: { errors }, watch, getValues } = methods;

  // 监听新邮箱变化，重置验证码状态
  const watchedNewEmail = watch('newEmail');
  useEffect(() => {
    setVerificationSentNew(false);
    setCountdownNew(0);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [watchedNewEmail]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // 发送新邮箱验证码
  const sendNewCode = async () => {
    const email = getValues('newEmail');
    if (!email) return;

    // 模拟API调用，实际项目中替换为真实API
    try {
      // await api.sendEmailCode({ email, type: 'new' });
      setVerificationSentNew(true);
      setCountdownNew(60);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        setCountdownNew((prev) => {
          if (prev <= 1) {
            setVerificationSentNew(false);
            setCountdownNew(0);
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      console.log('新邮箱验证码已发送');
    } catch (error) {
      console.error('发送新邮箱验证码失败', error);
      // 在实际中，这里应显示错误提示
    }
  };

  // 表单提交
  const onFormSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // 模拟提交，实际项目中替换为真实API
        console.log('提交数据:', data);
        // await api.changeEmailByPassword(data);
      }
    } catch (error) {
      console.error('更换邮箱失败', error);
      // 在实际中，这里应显示错误提示
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="w-full max-w-md mx-auto">
        {/* 账户密码输入 */}
        <FormField
          type="password"
          placeholder="请输入账户密码"
          error={errors.password?.message}
          {...methods.register('password')}
        />

        {/* 新邮箱输入 */}
        <FormField
          type="email"
          placeholder="请输入新邮箱"
          error={errors.newEmail?.message}
          {...methods.register('newEmail')}
        />

        {/* 新邮箱验证码 */}
        <VerificationCodeField
          placeholder="请输入新邮箱验证码"
          error={errors.newCode?.message}
          verificationSent={verificationSentNew}
          countdown={countdownNew}
          onSendCode={sendNewCode}
          {...methods.register('newCode')}
        />

        {/* 提交按钮 */}
        <SubmitButton label="确认更换" loading={loading} />
      </form>
    </FormProvider>
  );
};

export default ChangeEmailByPassword;