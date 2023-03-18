<template>
  <div>
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
          <n-button type="primary" @click="addRole">
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
    <n-modal v-model:show="showRolePermissionModal" :show-icon="false" preset="dialog" :title="editRoleTitle">
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

    <!-- 新增角色弹框 -->
    <n-modal v-model:show="showAddRoleModal" :show-icon="false" preset="dialog" title="新建角色">
      <n-form
        :model="addRoleFormParams"
        :rules="addRoleRules"
        ref="addRoleFormRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="角色名称" path="name">
          <n-input placeholder="请输入角色名称" v-model:value="addRoleFormParams.name" />
        </n-form-item>
        <n-form-item label="角色标识" path="type">
          <n-input placeholder="请输入角色标识" v-model:value="addRoleFormParams.type" />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showAddRoleModal = false)">取消</n-button>
          <n-button type="info" :loading="addRoleFormBtnLoading" @click="addRoleConfirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, unref, h} from 'vue';
  import { useMessage, useDialog } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { getRoleList, addRoleApi, delRoleApi } from '@/api/system/role';
  import { getPermissionList, getPermissionByRole, modifyPermissionByRole } from '@/api/system/permission'
  import { columns } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { getTreeAll } from '@/utils';
  // import { useRouter } from 'vue-router';

  // const router = useRouter();
  // const formRef: any = ref(null);
  const message = useMessage();
  const dialog = useDialog()

  const actionRef = ref();

  // 角色分配弹框
  const showRolePermissionModal = ref(false);
  const formBtnLoading = ref(false);

  // 新增角色弹框
  const showAddRoleModal = ref(false)

  // 权限分配
  const permissionCheckedAll = ref(false);

  // 当前分配权限的roleId
  const selectRoleId = ref()

  // 分配权限弹框标题
  const editRoleTitle = ref('');


  // 新增角色
  const addRoleFormBtnLoading = ref(false)
  const addRoleFormRef = ref()
  interface IAddRoleForm {
    name: string
    type: string
    is_default: 0 | 1
  }
  const addRoleRules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入角色名称',
    },
    type: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入角色标识',
    },
  };
  const addRoleFormParams: IAddRoleForm = reactive({
    name: '',
    type: '',
    is_default: 0
  })

  

  // 权限部分
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
          // {
          //   label: '编辑',
          //   onClick: handleEdit.bind(null, record),
          //   ifShow: () => {
          //     return true;
          //   },
          //   auth: ['dashboard_workplace'],
          // },
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

    // 新增 role 
  function addRole(){
    showAddRoleModal.value = true
  }

  // 新增 role
  function addRoleConfirmForm(){
    addRoleFormBtnLoading.value = true
    addRoleFormRef.value.validate((errors) => {
      if(!errors){
        addRoleApi<IAddRoleForm>({
          name: addRoleFormParams.name,
          type: addRoleFormParams.type,
          is_default: 0
        }).then(res => {
          message.success('新增角色成功')
          reloadTable()
          addRoleFormBtnLoading.value = false
        }, (err) => {
          addRoleFormBtnLoading.value = false
        })
        
      }else{
        message.error('请按要求输入');
        addRoleFormBtnLoading.value = false
      }
    })
  }

  /**
   * 刷新角色列表
   */
  function reloadTable() {
    actionRef.value.reload();
  }

  // function handleEdit(record: Recordable) {
  //   console.log('点击了编辑', record);
  //   router.push({ name: 'basic-info', params: { id: record.id } });
  // }

  // 删除角色
  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    dialog.info({
      title: '提示',
      content: `您确定想删除【${record['name']}】这个角色吗?`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        // 当前选中menu
        console.log('删除role_id =>', record.id)
        delRoleApi(record.id).then(res => {
          reloadTable()
          message.success('删除成功');
        })
        
      },
      onNegativeClick: () => {
        
      },
    });
  }

  function handleMenuAuth(record: Recordable) {
    editRoleTitle.value = `分配 ${record.name} 的菜单权限`;
    checkedKeys.value = record.menu_keys;
    showRolePermissionModal.value = true;

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
      showRolePermissionModal.value = false;
    }).finally(() => {
      formBtnLoading.value = false;
    })

    // formRef.value.validate((errors) => {
    //   if (!errors) {

    //     message.success('设置成功');
    //     setTimeout(() => {
    //       showRolePermissionModal.value = false;
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
