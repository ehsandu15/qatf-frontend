<template>
  <NuxtLayout />
</template>
<script setup>
definePageMeta({
  pageTransition: {
    name: "page",
    mode: "in-out",
  },
});
</script>
<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.4s ease, filter 0.4s ease;
  will-change: opacity, transform, filter;
}

.page-enter-from {
  opacity: 0;
  transform: scale(0.99) translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: scale(1.01) translateY(-5px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 1s;
  will-change: opacity, transform;
}
.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 1s;
  will-change: opacity, transform;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.scale-enter-enter-active,
.scale-enter-leave-active {
  transition: all 1s;
  will-change: opacity, transform;
}
.scale-enter-enter-from,
.scale-enter-leave-to {
  opacity: 0;
  transform: scale(1.06) translateY(-10px);
}
</style>
