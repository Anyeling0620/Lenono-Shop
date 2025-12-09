import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField } from '../Auth/FormField';
import { SubmitButton } from '../Auth/SubmitButton';

// 定义表单验证 schema
const schema = z.object({
  oldPassword: z.string().min(1, '请输入原密码'),
  newPassword: z.string().min(6, '新密码至少6位'),
}).refine((data) => data.oldPassword !== data.newPassword, {
  message: '新密码不能与原密码相同',
  path: ['newPassword'],
});

type FormData = z.infer<typeof schema>;

interface ChangePwdByPasswordProps {
  onSubmit?: (data: FormData) => Promise<void>; // 可选的提交回调
}

const ChangePwdByPassword: React.FC<ChangePwdByPasswordProps> = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const { handleSubmit, formState: { errors } } = methods;

  // 表单提交
  const onFormSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // 模拟提交，实际项目中替换为真实API
        console.log('提交数据:', data);
        // await api.changePwdByPassword(data);
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
        {/* 原密码输入 */}
        <FormField
          type="password"
          placeholder="请输入原密码"
          error={errors.oldPassword?.message}
          {...methods.register('oldPassword')}
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

export default ChangePwdByPassword;