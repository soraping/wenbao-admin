<template>
  <n-drawer-content :title="drawerInfo.title" closable>
    <MenuForm :form-params="formParams" ref="menuFormRef" :isEditMenu="isEditMenu"></MenuForm>
    <template #footer>
      <n-space>
        <n-button type="primary" :loading="subLoading" @click="formSubmit">提交</n-button>
        <n-button @click="handleReset">重置</n-button>
      </n-space>
    </template>
  </n-drawer-content>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive, defineEmits, inject } from 'vue'
  import { useMessage } from 'naive-ui';
  import { addMenu } from '@/api/system/menu';
  import { IMenu } from '@/utils/menu'
  import MenuForm from './menuForm.vue'

  const defaultValueRef = () => ({
    label: '',
    type: 1,
    key: '',
    component: '',
    auth: '',
    path: '',
    parent: null,
    icon: '',
    redirect: "",
    hidden: 0
  });

  interface IDrawerProps {
    parentId: any
    title: string
    refreshMenuList: () => void
  }

  const drawerInfo = inject<IDrawerProps>('drawerInfo', {
    parentId: null,
    title: "",
    refreshMenuList: () => {}
  })

  const emit = defineEmits<{
    (e: 'closeDrawer'): void
  }>();

  const message = useMessage()
  const formRef: any = ref();
  const menuFormRef = ref()

  let formParams = reactive(defaultValueRef())
  const isEditMenu = ref(true)
  const subLoading = ref(false)

  onMounted(() => {
    formRef.value = menuFormRef.value.formRef
  })

  function formSubmit() {
    formRef.value.validate((errors) => {
      if (!errors) {
        let params = {
          name: formParams.label,
          key: formParams.key,
          permission: formParams.auth,
          parent: drawerInfo.parentId,
          component: formParams.component,
          path: formParams.path,
          icon: formParams.icon,
          type: formParams.type,
          redirect: formParams.redirect,
          hidden: formParams.hidden
        }
        console.log('add menu =>', params)
        addMenu<Partial<IMenu>>(params).then((res) => {
          console.log(res)
          message.success('添加成功');
          handleReset();
          // 关闭弹框
          emit('closeDrawer')
          drawerInfo.refreshMenuList()
        })
        
      } else {
        message.error('请填写完整信息');
      }
    });
  }

  function handleReset() {
    formRef.value.restoreValidation();
    formParams = Object.assign(formParams, defaultValueRef());
  }

</script>
