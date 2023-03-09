<template>
  <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="100"
        v-show="isEditMenu"
      >
        <n-form-item label="类型" path="type">
          <span>{{ formParams.type === 1 ? '侧边栏菜单' : '' }}</span>
        </n-form-item>
        <n-form-item label="标题" path="label">
          <n-input placeholder="请输入标题" v-model:value="formParams.label" />
        </n-form-item>
        <n-form-item label="唯一标识" path="key">
          <n-input placeholder="请输入唯一标识" v-model:value="formParams.key" />
        </n-form-item>
        <n-form-item label="跳转路径" path="path">
          <n-input placeholder="请输入路径" v-model:value="formParams.path" />
        </n-form-item>
        <n-form-item label="模块路径" path="component">
          <n-input placeholder="请输入模块相对路径" v-model:value="formParams.component" />
        </n-form-item>
        <n-form-item label="菜单权限" path="auth">
          <n-input placeholder="请输入权限" v-model:value="formParams.auth" />
        </n-form-item>
        <n-form-item label="图标" path="icon">
          <n-input placeholder="请输入图标名称" v-model:value="formParams.icon" />
        </n-form-item>
      </n-form>
</template>

<script lang="ts" setup>
  import {defineProps, defineExpose, ref} from 'vue'
  const rules = {
    label: {
      required: true,
      message: '请输入标题',
      trigger: 'blur',
    },
    key: {
      required: true,
      message: '请输入唯一标识',
      trigger: 'blur',
    },
    path: {
      required: true,
      message: '请输入路径',
      trigger: 'blur',
    },
    component: {
      required: true,
      message: '请输入模块路径',
      trigger: 'blur',
    },
  };

  defineProps<{
    formParams: any,
    isEditMenu?: boolean
  }>()

  const formRef = ref();

  defineExpose({
    formRef 
	})

</script>
