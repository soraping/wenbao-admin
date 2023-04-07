import { FormSchema } from '@/components/Form/index';

export const memberSearchSchemas: FormSchema[] = [
    {
      field: 'username',
      component: 'NInput',
      label: '姓名',
      componentProps: {
        placeholder: '请输入姓名',
        onInput: (e: any) => {
        //   console.log(e);
        },
      },
    //   rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
    },
    {
      field: 'mobile',
      component: 'NInputNumber',
      label: '手机',
      componentProps: {
        placeholder: '请输入手机号码',
        showButton: false,
        onInput: (e: any) => {
        //   console.log(e);
        },
      },
    }
  ];