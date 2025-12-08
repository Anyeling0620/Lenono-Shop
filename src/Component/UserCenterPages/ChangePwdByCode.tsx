import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField } from '../Auth/FormField';
import { VerificationCodeField } from '../Auth/VerificationCodeField';
import { SubmitButton } from '../Auth/SubmitButton';

// 定义表单验证 schema
const schema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  code: z.string().regex(/^\d{6}$/, '验证码必须为6位数字'),
  newPassword: z.string().min(6, '新密码至少6位'),
});

type FormData = z.infer<typeof schema>;

interface ChangePwdByCodeProps {
  onSubmit?: (data: FormData) => Promise<void>; // 可选的提交回调
}

const ChangePwdByCode: React.FC<ChangePwdByCodeProps> = ({ onSubmit }) => {
  const [verificationSent, setVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
    },
  });

  const { handleSubmit, formState: { errors }, watch, getValues } = methods;

  // 监听邮箱变化，重置验证码状态
  const watchedEmail = watch('email');
  useEffect(() => {
    setVerificationSent(false);
    setCountdown(0);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [watchedEmail]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // 发送邮箱验证码
  const sendCode = async () => {
    const email = getValues('email');
    if (!email) return;

    // 模拟API调用，实际项目中替换为真实API
    try {
      // await api.sendEmailCode({ email, type: 'reset' });
      setVerificationSent(true);
      setCountdown(60);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setVerificationSent(false);
            setCountdown(0);
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      console.log('邮箱验证码已发送');
    } catch (error) {
      console.error('发送验证码失败', error);
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
        // await api.changePwdByCode(data);
      }
    } catch (error) {
      console.error('更改密码失败', error);
      // 在实际中，这里应显示错误提示
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="w-full max-w-md mx-auto">
        {/* 邮箱输入 */}
        <FormField
          type="email"
          placeholder="请输入邮箱"
          error={errors.email?.message}
          {...methods.register('email')}
        />

        {/* 邮箱验证码 */}
        <VerificationCodeField
          placeholder="请输入邮箱验证码"
          error={errors.code?.message}
          verificationSent={verificationSent}
          countdown={countdown}
          onSendCode={sendCode}
          {...methods.register('code')}
        />

        {/* 新密码输入 */}
        <FormField
          type="password"
          placeholder="请输入新密码"
          error={errors.newPassword?.message}
          {...methods.register('newPassword')}
        />

        {/* 提交按钮 */}
        <SubmitButton label="确认修改" loading={loading} />
      </form>
    </FormProvider>
  );
};

export default ChangePwdByCode;