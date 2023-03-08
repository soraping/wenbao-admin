<template>
  <n-drawer-content :title="title" closable>
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
  import { ref, onMounted, reactive, defineProps, defineEmits } from 'vue'
  import { useMessage } from 'naive-ui';
  import MenuForm from './menuForm.vue'

  const defaultValueRef = () => ({
    label: '',
    type: 1,
    key: '',
    component: '',
    openType: 1,
    auth: '',
    path: '',
  });

  defineProps<{
    title: string
  }>()

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
        message.success('添加成功');
        handleReset();
        // 关闭弹框
        emit('closeDrawer')
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
