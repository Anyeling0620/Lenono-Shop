import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField } from '../Auth/FormField';
import { VerificationCodeField } from '../Auth/VerificationCodeField';
import { SubmitButton } from '../Auth/SubmitButton';

// 定义表单验证 schema
const schema = z.object({
  oldEmail: z.string().email('请输入有效的旧邮箱地址'),
  oldCode: z.string().regex(/^\d{6}$/, '验证码必须为6位数字'),
  newEmail: z.string().email('请输入有效的新邮箱地址').refine((val) => val !== '', { message: '请输入新邮箱地址' }),
  newCode: z.string().regex(/^\d{6}$/, '验证码必须为6位数字'),
}).refine((data) => data.oldEmail !== data.newEmail, {
  message: '新邮箱不能与旧邮箱相同',
  path: ['newEmail'],
});

type FormData = z.infer<typeof schema>;

interface ChangeEmailByCodeProps {
  onSubmit?: (data: FormData) => Promise<void>; // 可选的提交回调
}

const ChangeEmailByCode: React.FC<ChangeEmailByCodeProps> = ({ onSubmit }) => {
  const [verificationSentOld, setVerificationSentOld] = useState(false);
  const [countdownOld, setCountdownOld] = useState(0);
  const [verificationSentNew, setVerificationSentNew] = useState(false);
  const [countdownNew, setCountdownNew] = useState(0);
  const [loading, setLoading] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldEmail: '',
      oldCode: '',
      newEmail: '',
      newCode: '',
    },
  });

  const { handleSubmit, formState: { errors }, watch } = methods;

  // 监听旧邮箱变化，重置验证码状态
  const watchedOldEmail = watch('oldEmail');
  useEffect(() => {
    if (watchedOldEmail) {
      setVerificationSentOld(false);
      setCountdownOld(0);
    }
  }, [watchedOldEmail]);

  // 监听新邮箱变化，重置验证码状态
  const watchedNewEmail = watch('newEmail');
  useEffect(() => {
    if (watchedNewEmail) {
      setVerificationSentNew(false);
      setCountdownNew(0);
    }
  }, [watchedNewEmail]);

  // 倒计时逻辑
  useEffect(() => {
    let interval: number;
    if (countdownOld > 0) {
      interval = window.setInterval(() => setCountdownOld((c) => c - 1), 1000);
    }
    if (countdownNew > 0) {
      interval = window.setInterval(() => setCountdownNew((c) => c - 1), 1000);
    }
    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [countdownOld, countdownNew]);

  // 发送旧邮箱验证码
  const sendOldCode = async () => {
    const email = methods.getValues('oldEmail');
    if (!email) return;

    // 模拟API调用，实际项目中替换为真实API
    try {
      // await api.sendEmailCode({ email, type: 'old' });
      setVerificationSentOld(true);
      setCountdownOld(60);
      console.log('旧邮箱验证码已发送');
    } catch (error) {
      console.error('发送旧邮箱验证码失败', error);
      // 在实际中，这里应显示错误提示
    }
  };

  // 发送新邮箱验证码
  const sendNewCode = async () => {
    const email = methods.getValues('newEmail');
    if (!email) return;

    // 模拟API调用，实际项目中替换为真实API
    try {
      // await api.sendEmailCode({ email, type: 'new' });
      setVerificationSentNew(true);
      setCountdownNew(60);
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
        // await api.changeEmailByCode(data);
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
        {/* 旧邮箱输入 */}
        <FormField
          type="email"
          placeholder="请输入旧邮箱"
          error={errors.oldEmail?.message}
          {...methods.register('oldEmail')}
        />

        {/* 旧邮箱验证码 */}
        <VerificationCodeField
          placeholder="请输入旧邮箱验证码"
          error={errors.oldCode?.message}
          verificationSent={verificationSentOld}
          countdown={countdownOld}
          onSendCode={sendOldCode}
          {...methods.register('oldCode')}
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

export default ChangeEmailByCode;