<template>
  <Transition :name="transitionName" :mode="transitionMode">
    <div v-if="isInView" :ref="elementRef">
      <slot />
    </div>
  </Transition>
</template>
<script setup lang="ts">
import type { VNodeRef } from "vue";

const elementRef = ref<VNodeRef | null>(null);
const { isInView } = useInView(elementRef);
defineProps<{
  transitionName: string;
  transitionMode: "in-out" | "out-in" | "default";
}>();
console.log("isInView", isInView);
</script>
