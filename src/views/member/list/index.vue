<template>
  <div>
    <div class="n-layout-page-header">

      <n-card :bordered="false" class="proCard">

      <BasicForm @register="register" @submit="handleSearchSubmit" @reset="handleSearchReset">
        <template #statusSlot="{ model, field }">
          <n-input v-model:value="model[field]" />
        </template>
      </BasicForm>

      <BasicTable
        :columns="columns"
        :request="loadMemberListTable"
        :row-key="(row) => row.id"
        ref="memberListTableRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedMemberListRow"
      >
        <template #tableTitle>
          <n-button type="primary" @click="addMemberModal">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            添加会员
          </n-button>
        </template>

        <template #action>
          <TableAction />
        </template>
      </BasicTable>
    </n-card>
    </div>

    <!-- 新增会员弹框 -->
    <n-modal v-model:show="showAddUserModal" :show-icon="false" preset="dialog" title="新建会员">
      <n-form
        :model="addUserFormParams"
        :rules="addUserRules"
        ref="addRoleFormRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="会员名称" path="username">
          <n-input placeholder="请输入会员名称" v-model:value="addUserFormParams.username" maxlength=20 />
        </n-form-item>
        <n-form-item label="手机号" path="mobile">
          <n-input type="number" placeholder="请输入手机号" v-model:value="addUserFormParams.mobile" maxlength=20 />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showAddUserModal = false)">取消</n-button>
          <n-button type="info" :loading="addUserFormBtnLoading" @click="addUserConfirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>

  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    reactive,
    unref,
    h
  } from 'vue'
  import { useMessage, useDialog } from 'naive-ui';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { PlusOutlined } from '@vicons/antd';
  import { memberListApi, addMemberApi, modifyMemberStatus } from '@/api/member/index'
  import { columns } from './columns'
  import { memberSearchSchemas } from './searchSchema'
  import { BasicTable, TableAction } from '@/components/Table';

  const message = useMessage();
  const dialog = useDialog()

  const pageParams = reactive({
      pageSize: 10,
      pageNo: 1,
      username: '',
      mobile: ''
    });

  const addUserRules = {
    username: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入用户名',
    },
    mobile: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入手机号',
    },
  }

  const memberListTableRef = ref()

  const loadMemberListTable = async (res: any) => {
    let _params = {
        ...unref(pageParams),
        ...res,
      };
      let userList = await memberListApi(_params);
      return userList
  }

  // 筛选
  const [register, {}] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas: memberSearchSchemas,
  });
  function handleSearchSubmit(values: Recordable){
    pageParams.mobile = values.mobile || ""
    pageParams.username = values.username || ""
    reloadTable()
  }
  function handleSearchReset(values: Recordable){
    console.log(values);
  }

  // 新建会员
  const showAddUserModal = ref(false)
  const addUserFormBtnLoading = ref(false)
  function addMemberModal(){
    showAddUserModal.value = true
  }
  interface IUser {
    username: string
    mobile: string
  }
  const addUserFormParams: IUser = reactive({
    username: '',
    mobile: ''
  })
  function addUserConfirmForm(e){
    e.preventDefault();
    addUserFormBtnLoading.value = true
    addMemberApi(addUserFormParams).then(res => {
      message.success('设置成功');
      reloadTable()
      showAddUserModal.value = false
      addUserFormParams.mobile = ''
      addUserFormParams.username = ''
    }).finally(() => {
      addUserFormBtnLoading.value = false
    })
  }


  /**
   * 刷新会员列表
   */
  function reloadTable() {
    memberListTableRef.value.reload();
  }

  /**
   * 批量选择
   */
  function onCheckedMemberListRow(key){
    console.log('key', key)
  }

  const actionColumn = reactive({
    width: 250,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '详情',
            onClick: handleMemberInfo.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['dashboard_workplace'],
          },
          // {
          //   label: '编辑',
          //   onClick: handleMemberEdit.bind(null, record),
          //   ifShow: () => {
          //     return true;
          //   },
          //   auth: ['dashboard_workplace'],
          // },
          {
            label: '锁定',
            type: 'warning',
            onclick: handleMemberStatus.bind(null, record, 2),
            ifShow: () => {
              return record.status != 2;
            },
            auth: ['dashboard_workplace'],
          },
          {
            label: '解除锁定',
            type: 'warning',
            onclick: handleMemberStatus.bind(null, record, 1),
            ifShow: () => {
              return record.status == 2;
            },
            auth: ['dashboard_workplace'],
          },
          {
            label: '删除',
            type: 'error',
            onclick: handleMemberStatus.bind(null, record, 0),
            ifShow: () => {
              return true;
            },
            auth: ['dashboard_workplace'],
          }
        ],
      });
    },
  });

  function handleMemberInfo(record){
    console.log('user-info => ', record)
  }

  function handleMemberStatus(record, status){
    let statusMsg = `您确定要删除 【${record['username']}】这个会员吗？`
    if(status != 0){
      statusMsg = status == 2 ? `您确定要锁定 【${record['username']}】这个会员吗？` : `您确定要解除锁定 【${record['username']}】这个会员吗？`
    }
    dialog.warning({
      title: '警告',
      content: statusMsg,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        modifyMemberStatus(record.id, status).then(res => {
          message.success('设置成功');
          reloadTable()
        })
      },
      onNegativeClick: () => {
        
      },
    });
  }

  // function handleMemberEdit(record){
  //   console.log('user-edit => ', record)
  // }

</script>
