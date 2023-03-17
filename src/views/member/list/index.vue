<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="会员列表">
      </n-card>

      <n-card :bordered="false" class="mt-4 proCard">
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
          <n-input placeholder="请输入会员名称" v-model:value="addUserFormParams.username" />
        </n-form-item>
        <n-form-item label="手机号" path="mobile">
          <n-input placeholder="请输入手机号" v-model:value="addUserFormParams.mobile" />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showAddUserModal = false)">取消</n-button>
          <n-button type="info" :loading="addUserFormBtnLoading" @click="addRoleConfirmForm">确定</n-button>
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
  import { PlusOutlined } from '@vicons/antd';
  import { memberListApi, addMemberApi } from '@/api/member/index'
  import { columns } from './columns'
  import { BasicTable, TableAction } from '@/components/Table';

  const pageParams = reactive({
      pageSize: 10,
      pageNo: 1,
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

  const loadMemberListTable = async (res: any) => {
    let _params = {
        ...unref(pageParams),
        ...res,
      };
      let roles = await memberListApi(_params);
      return roles
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
  function addRoleConfirmForm(){

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
      return h(TableAction, {
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
          }
        ],
      });
    },
  });

  function handleMemberInfo(record){
    console.log('user-info => ', record)
  }

</script>
