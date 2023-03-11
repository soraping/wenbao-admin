<template>
  <div>
    <n-grid class="mt-4" cols="1 s:1 m:1 l:3 xl:3 2xl:3" responsive="screen" :x-gap="12">
      <n-gi span="1">
        <n-card :segmented="{ content: true }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-dropdown trigger="hover" @select="selectAddMenu" :options="addMenuOptions">
                <n-button type="info" ghost icon-placement="right">
                  添加菜单
                  <template #icon>
                    <div class="flex items-center">
                      <n-icon size="14">
                        <DownOutlined />
                      </n-icon>
                    </div>
                  </template>
                </n-button>
              </n-dropdown>
              <n-button type="info" ghost icon-placement="left" @click="packHandle">
                全部{{ expandedKeys.length ? '收起' : '展开' }}
                <template #icon>
                  <div class="flex items-center">
                    <n-icon size="14">
                      <AlignLeftOutlined />
                    </n-icon>
                  </div>
                </template>
              </n-button>
            </n-space>
          </template>
          <div class="w-full menu">
            <n-input type="input" v-model:value="pattern" placeholder="输入菜单名称搜索">
              <template #suffix>
                <n-icon size="18" class="cursor-pointer">
                  <SearchOutlined />
                </n-icon>
              </template>
            </n-input>
            <div class="py-3 menu-list">
              <template v-if="loading">
                <div class="flex items-center justify-center py-4">
                  <n-spin size="medium" />
                </div>
              </template>
              <template v-else>
                <n-tree
                  block-line
                  cascade
                  checkable
                  :virtual-scroll="true"
                  :pattern="pattern"
                  :data="treeData"
                  :expandedKeys="expandedKeys"
                  style="max-height: 650px; overflow: hidden"
                  @update:selected-keys="selectedTree"
                  @update:expanded-keys="onExpandedKeys"
                />
              </template>
            </div>
          </div>
        </n-card>
      </n-gi>
      <n-gi span="2">
        <n-card :segmented="{ content: true }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-icon size="18">
                <FormOutlined />
              </n-icon>
              <span>编辑菜单{{ treeItemTitle ? `：${treeItemTitle}` : '' }}</span>
            </n-space>
          </template>
          <n-alert type="info" closable> 从菜单列表选择一项后，进行编辑</n-alert>
          <MenuForm :form-params="formParams" :isEditMenu="isEditMenu" ref="menuFormRef" ></MenuForm>
          <template #footer>
            <n-space v-show="isEditMenu">
              <n-button type="primary" :loading="subLoading" @click="formSubmit"
                >保存修改</n-button
              >
              <n-button @click="handleReset">重置</n-button>
              <n-button v-if="canShowRemoveButton" @click="handleDel">删除</n-button>
            </n-space>
          </template>
        </n-card>
      </n-gi>
    </n-grid>
    <CreateDrawer ref="createDrawerRef" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive, onMounted, computed, provide } from 'vue';
  import { useDialog, useMessage } from 'naive-ui';
  import { DownOutlined, AlignLeftOutlined, SearchOutlined, FormOutlined } from '@vicons/antd';
  import { getMenuList, delMenu } from '@/api/system/menu';
  import { getTreeItem } from '@/utils';
  import { MenuTree } from '@/utils/menu'
  import CreateDrawer from './CreateDrawer.vue';
  import MenuForm from './menuForm.vue'

  const createDrawerRef = ref();
  const menuFormRef = ref()

  const message = useMessage();
  const dialog = useDialog();

  let formRef = ref()
  let treeItemKey = ref([]);

  let expandedKeys = ref([]);

  // 是否展示删除菜单按钮
  // 是否有子菜单，有则不展示
  let canShowRemoveButton = ref(false)

  const treeData = ref<any>([]);

  const loading = ref(true);
  const subLoading = ref(false);
  const isEditMenu = ref(false);
  const treeItemTitle = ref('');
  const treeItemId = ref(0)
  const pattern = ref('');

  // 弹框上级编号
  const drawerInfo = reactive({
    title: "",
    parentId: null
  })
  provide('drawerInfo', drawerInfo)


  const isAddSon = computed(() => {
    return !treeItemKey.value.length;
  });

  const addMenuOptions = ref([
    {
      label: '添加顶级菜单',
      key: 'home',
      disabled: false,
    },
    {
      label: '添加子菜单',
      key: 'son',
      disabled: isAddSon,
    },
  ]);

  const formParams = reactive({
    id: 0,
    type: 1,
    label: '',
    key: '',
    path: '',
    auth: '',
    component: '',
    icon: '',
    parent: null
  });

  onMounted(() => {
    formRef.value = menuFormRef.value.formRef
  })

  function selectAddMenu(key: string) {
    if(key === 'home'){
      drawerInfo.title = '添加顶栏菜单'
      drawerInfo.parentId = null
    }else{
      drawerInfo.title = `添加子菜单：${treeItemTitle.value}`;
      drawerInfo.parentId = treeItemId.value as any
    }
    openCreateDrawer();
  }

  function openCreateDrawer() {
    const { openDrawer } = createDrawerRef.value;
    openDrawer();
  }

  function selectedTree(keys) {
    if (keys.length) {
      const treeItem = getTreeItem(unref(treeData), keys[0]);
      treeItemKey.value = keys;
      treeItemTitle.value = treeItem.label;
      treeItemId.value = treeItem.id
      Object.assign(formParams, treeItem);
      isEditMenu.value = true;
      canShowRemoveButton.value = treeItem.children && treeItem.children.length ? false : true
    } else {
      isEditMenu.value = false;
      treeItemKey.value = [];
      treeItemTitle.value = '';
      treeItemId.value = 0
    }
  }

  function handleDel() {
    dialog.info({
      title: '提示',
      content: `您确定想删除此菜单吗?`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        // 当前选中menu
        console.log('删除menu_id =>', treeItemId.value)
        delMenu(treeItemId.value).then(res => {
          console.log(res)
          // message.success('删除成功');
        })
        
      },
      onNegativeClick: () => {
        message.error('已取消');
      },
    });
  }

  function handleReset() {
    const treeItem = getTreeItem(unref(treeData), treeItemKey.value[0]);
    Object.assign(formParams, treeItem);
  }

  function formSubmit() {
    formRef.value.validate((errors: boolean) => {
      if (!errors) {
        console.log(formParams)
        message.error('抱歉，您没有该权限');
      } else {
        message.error('请填写完整信息');
      }
    });
  }

  function packHandle() {
    if (expandedKeys.value.length) {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = unref(treeData).map((item: any) => item.key as string) as [];
    }
  }

  onMounted(async () => {
    let treeMenuList = await getMenuList();
    let menuTrees = new MenuTree(treeMenuList).genMenuTree()
    const keys = menuTrees.map((item) => item.key);
    Object.assign(formParams, keys);
    treeData.value = menuTrees;
    loading.value = false;
  });

  function onExpandedKeys(keys) {
    expandedKeys.value = keys;
  }
</script>
