<template>
  <n-drawer v-model:show="isDrawer" :width="width" :placement="placement">
    <DrawerContent @closeDrawer="closeDrawer" ></DrawerContent>
  </n-drawer>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs} from 'vue';
  import DrawerContent from './DrawerContent.vue'

  export default defineComponent({
    name: 'CreateDrawer',
    components: {DrawerContent},
    props: {
      width: {
        type: Number,
        default: 450,
      },
    },

    setup() {

      const state = reactive({
        isDrawer: false,
        placement: 'right'
      });

      function openDrawer() {
        state.isDrawer = true;
      }

      function closeDrawer() {
        state.isDrawer = false;
      }

      return {
        ...toRefs(state),
        openDrawer,
        closeDrawer,
      };
    },
  });
</script>
