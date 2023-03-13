import { h } from 'vue';
import { NTag } from 'naive-ui';

export const columns = [
  {
    title: 'id',
    key: 'id',
  },
  {
    title: '角色名称',
    key: 'name',
  },
  {
    title: '类型',
    key: 'type',
  },
  {
    title: '是否默认角色',
    key: 'is_default',
    render(row) {
      return h(
        NTag,
        {
          type: row.is_default ? 'success' : 'error',
        },
        {
          default: () => (row.is_default ? '是' : '否'),
        }
      );
    },
  },
  {
    title: '创建时间',
    key: 'create_time',
  },
];
