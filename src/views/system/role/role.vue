<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="角色权限管理">
        适用于菜单权限
      </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
      >
        <template #tableTitle>
          <n-button type="primary">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            添加角色
          </n-button>
        </template>

        <template #action>
          <TableAction />
        </template>
      </BasicTable>
    </n-card>

    <!-- 给角色分配权限 -->
    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="editRoleTitle">
      <div class="py-3 menu-list">
        <n-tree
          block-line
          cascade
          checkable
          :virtual-scroll="true"
          :data="permissionTreeData"
          :checked-keys="checkedKeys"
          style="max-height: 950px; overflow: hidden"
          @update:checked-keys="checkedTree"
        />
      </div>
      <template #action>
        <n-space>
          <!-- <n-button type="info" ghost icon-placement="left" @click="packHandle">
            全部{{ expandedKeys.length ? '收起' : '展开' }}
          </n-button> -->
          <n-button type="info" ghost icon-placement="left" @click="checkedAllHandle">
            全部{{ permissionCheckedAll ? '取消' : '选择' }}
          </n-button>
          <n-button type="primary" :loading="formBtnLoading" @click="confirmPermissionForm">提交权限</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, unref, h} from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { getRoleList } from '@/api/system/role';
  import { getPermissionList, getPermissionByRole, modifyPermissionByRole } from '@/api/system/permission'
  import { columns } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { getTreeAll } from '@/utils';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  // const formRef: any = ref(null);
  const message = useMessage();
  const actionRef = ref();

  const showModal = ref(false);
  const formBtnLoading = ref(false);

  // 权限分配
  const permissionCheckedAll = ref(false);

  // 当前分配权限的roleId
  const selectRoleId = ref()

  // 分配权限弹框标题
  const editRoleTitle = ref('');

  interface IPermission {
    label: string
    value: string
    key: string
    id: number
  }

  // 系统设定的所有权限
  const permissionTreeData = ref<IPermission[]>([]);

  // const expandedKeys = ref([]);
  // 分配权限
  const checkedKeys = ref();

  const pageParams = reactive({
    pageSize: 5,
    pageNo: 1,
  });

  const actionColumn = reactive({
    width: 250,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction, {
        style: 'button',
        actions: [
          {
            label: '分配权限',
            onClick: handleMenuAuth.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['dashboard_workplace'],
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            auth: ['dashboard_workplace'],
          },
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['dashboard_workplace'],
          },
        ],
      });
    },
  });

  const loadDataTable = async (res: any) => {
    let _params = {
      ...unref(pageParams),
      ...res,
    };
    let roles = await getRoleList(_params);
    return roles
  };

  function onCheckedRow(rowKeys: any[]) {
    console.log(rowKeys);
  }

  // function reloadTable() {
  //   actionRef.value.reload();
  // }

  function handleEdit(record: Recordable) {
    console.log('点击了编辑', record);
    router.push({ name: 'basic-info', params: { id: record.id } });
  }

  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    message.info('点击了删除');
  }

  function handleMenuAuth(record: Recordable) {
    editRoleTitle.value = `分配 ${record.name} 的菜单权限`;
    checkedKeys.value = record.menu_keys;
    showModal.value = true;

    // 当前角色已分配的权限
    let role_id = record.id
    selectRoleId.value = role_id

    getPermissionByRole(role_id).then(res => {
      // 初始化已分配权限
      checkedKeys.value = res.map(permisson => permisson.key)
    })
  }

  function checkedTree(keys) {
    checkedKeys.value = [checkedKeys.value, ...keys];
  }

  // function onExpandedKeys(keys) {
  //   expandedKeys.value = keys;
  // }

  // function packHandle() {
  //   if (expandedKeys.value.length) {
  //     expandedKeys.value = [];
  //   } else {
  //     expandedKeys.value = permissionTreeData.value.map((item: any) => item.key) as [];
  //   }
  // }

  function checkedAllHandle() {
    if (!permissionCheckedAll.value) {
      checkedKeys.value = getTreeAll(permissionTreeData.value);
      permissionCheckedAll.value = true;
    } else {
      checkedKeys.value = [];
      permissionCheckedAll.value = false;
    }
  }

  function confirmPermissionForm(e: any) {
    e.preventDefault();
    formBtnLoading.value = true;

    // 将 keys换成permission ids
    let keys = checkedKeys.value
    let permissionList = permissionTreeData.value
    let ids = permissionList.filter(permission => keys.includes(permission.key)).map(permission =>permission.id)

    let params = {
      role_id: selectRoleId.value,
      ids
    }
    modifyPermissionByRole(params).then(res => {
      message.success('设置成功');
      showModal.value = false;
    }).finally(() => {
      formBtnLoading.value = false;
    })

    // formRef.value.validate((errors) => {
    //   if (!errors) {

    //     message.success('设置成功');
    //     setTimeout(() => {
    //       showModal.value = false;
    //       // reloadTable();
    //     });
    //   } else {
    //     message.error('请选择权限');
    //   }
    //   formBtnLoading.value = false;
    // });
  }

  onMounted(async () => {
    const permissionList = await getPermissionList();
    permissionTreeData.value = permissionList;
  });
</script>

<style lang="less" scoped></style>
