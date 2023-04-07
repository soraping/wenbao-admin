import { h } from 'vue';
import { NTag } from 'naive-ui';

export const columns = [
  {
    title: 'id',
    key: 'id',
  },
  {
    title: '名称',
    key: 'username',
  },
  {
    title: '手机号',
    key: 'mobile',
  },
  {
    title: '状态',
    key: 'status',
    render(row){
      return h(
        NTag,
        {
          type: row.status == 1 ? 'success' : 'error',
        },
        {
          default: () => (row.status == 1 ? '正常' : '锁定'),
        }
      );
    }
  },
  // {
  //   title: '是否默认角色',
  //   key: 'is_default',
  //   render(row) {
  //     return h(
  //       NTag,
  //       {
  //         type: row.is_default ? 'success' : 'error',
  //       },
  //       {
  //         default: () => (row.is_default ? '是' : '否'),
  //       }
  //     );
  //   },
  // },
  {
    title: '创建时间',
    key: 'create_time',
  },
];
